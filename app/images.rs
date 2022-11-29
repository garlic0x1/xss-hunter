use crate::State;
use axum::extract::{Extension, Json, Path};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum_sessions::extractors::ReadableSession;
use serde::{Deserialize, Serialize};

pub async fn get_image(
    Extension(state): Extension<State>,
    Path(path): Path<i32>,
    session: ReadableSession,
) -> impl IntoResponse {
    let username = session.get::<String>("username").unwrap();

    let row: (String,) = sqlx::query_as("SELECT username FROM pages WHERE id=?")
        .bind(path)
        .fetch_one(&state.db_pool)
        .await
        .unwrap();

    if username != row.0 {
        // user doesnt own this record
        return StatusCode::UNAUTHORIZED;
    }

    // get image
    
}
