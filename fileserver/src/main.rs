mod files;

use axum::routing::{delete, get, post};
use axum::Extension;
use clap::Parser;
use std::net::{IpAddr, SocketAddr};
use std::str::FromStr;
use tower::ServiceBuilder;
use tower_http::trace::TraceLayer;

#[derive(Parser, Debug)]
struct Opt {
    /// set the listen addr
    #[clap(short = 'a', long = "addr", default_value = "0.0.0.0")]
    addr: String,

    /// set the listen port
    #[clap(short = 'p', long = "port", default_value = "3000")]
    port: u16,

    // directory from which files will be served
    #[clap(short = 'd', long = "dir", default_value = "./local")]
    directory: String,
}

#[derive(Clone)]
pub struct State {
    directory: String,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let opt = Opt::parse();

    // set up logging
    if std::env::var("RUST_LOG").is_err() {
        std::env::set_var("RUST_LOG", "debug,hyper=info,mio=info")
    }
    tracing_subscriber::fmt::init();
    let logging_layer = ServiceBuilder::new().layer(TraceLayer::new_for_http());

    let state_layer = Extension(State {
        directory: "./local".into(),
    });

    // define tower routers
    let app = axum::Router::new()
        .route("/:filename", get(files::get_file))
        .route("/:filename", post(files::put_file))
        .route("/:filename", delete(files::del_file))
        .layer(state_layer)
        .layer(logging_layer);

    let sock_addr = SocketAddr::from((IpAddr::from_str(opt.addr.as_str())?, opt.port));

    println!("listening on http://{}", sock_addr);

    axum::Server::bind(&sock_addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}
