mod auth;
mod auxiliary;
mod callback;
mod data;

use axum::routing::{delete, get, get_service, post};
use axum::{Extension, Router};
use clap::Parser;
use std::net::{IpAddr, SocketAddr};
use std::str::FromStr;
use tower::ServiceBuilder;
use tower_http::cors::CorsLayer;
use tower_http::services::{ServeDir, ServeFile};
use tower_http::trace::TraceLayer;

#[derive(Parser)]
struct Opt {
    /// set the listen addr
    #[clap(short = 'a', long = "addr", default_value = "0.0.0.0")]
    addr: String,

    /// set the listen port
    #[clap(short = 'p', long = "port", default_value = "8080")]
    port: u16,

    /// set the hostname if not set by env variable
    /// (this will be used to generate payloads)
    #[clap(long = "host", default_value = "localhost")]
    hostname: String,

    /// set the directory where static files are to be found
    #[clap(long = "static-dir", default_value = "./frontend")]
    static_dir: String,
}

#[derive(Clone)]
pub struct State {
    db_pool: sqlx::MySqlPool,
    jinja: minijinja::Environment<'static>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let opt = Opt::parse();

    // load env vars from .env
    dotenv::dotenv();

    // set up logging
    if std::env::var("RUST_LOG").is_err() {
        std::env::set_var("RUST_LOG", "debug,hyper=info,mio=info")
    }
    tracing_subscriber::fmt::init();

    // set up session auth
    let store = async_sqlx_session::MySqlSessionStore::new(&std::env::var("DATABASE_URL")?).await?;
    let session_key = std::env::var("SESSION_KEY")?;
    store.migrate().await?;
    store.cleanup().await?;

    // define tower layers
    let auth_layer = axum::middleware::from_fn(auth::check_auth);
    let logging_layer = ServiceBuilder::new().layer(TraceLayer::new_for_http());
    let session_layer =
        axum_sessions::SessionLayer::new(store, session_key.as_bytes()).with_secure(false);
    let state_layer = Extension(State {
        jinja: auxiliary::jinja_env(),
        db_pool: auxiliary::db_connect()?,
    });

    // define tower routers
    let spa_router = get_service(
        ServeDir::new(opt.static_dir.clone())
            .not_found_service(ServeFile::new(format!("{}/index.html", opt.static_dir))),
    )
    .handle_error(auxiliary::handle_error);

    let api_router = axum::Router::new()
        .route("/payloads", get(data::get_payloads))
        .route("/pages", get(data::get_pages))
        .route("/pages/:id", get(data::get_page))
        .route("/pages/:id", delete(data::delete_page))
        .route("/scripts", get(data::get_scripts))
        .route("/scripts", post(data::add_script));

    let callback_router = axum::Router::new()
        .route("/:user", get(callback::probe))
        .route("/:user", post(callback::collector))
        .layer(CorsLayer::permissive());

    let auth_router = axum::Router::new()
        .route("/signup", post(auth::signup))
        .route("/login", post(auth::login))
        .route("/logout", get(auth::logout))
        .route("/check", get(auth::get_auth));

    let app = Router::new()
        .nest("/api", api_router)
        // requrire auth for api, not for anything else
        .route_layer(auth_layer)
        .nest("/callback", callback_router)
        .nest("/auth", auth_router)
        .fallback(spa_router)
        .layer(session_layer)
        .layer(state_layer)
        .layer(logging_layer);

    let sock_addr = SocketAddr::from((IpAddr::from_str(opt.addr.as_str())?, opt.port));

    println!("listening on http://{}", sock_addr);

    axum::Server::bind(&sock_addr)
        .serve(app.into_make_service_with_connect_info::<SocketAddr>())
        .await?;

    Ok(())
}
