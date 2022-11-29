use crate::State;

use axum::body::StreamBody;
use axum::extract::{Json, Path};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Extension;
use serde::{Deserialize, Serialize};
use std::fs::File as SysFile;
use std::io::prelude::*;
use tokio::fs::File;
use tokio_util::io::ReaderStream;

pub async fn get_file(
    Extension(state): Extension<State>,
    Path(filename): Path<String>,
) -> impl IntoResponse {
    let file = match File::open(format!("{}/{}", state.directory, filename)).await {
        Ok(file) => file,
        Err(_err) => return StatusCode::NOT_FOUND.into_response(),
    };

    let stream = ReaderStream::new(file);
    let body = StreamBody::new(stream);
    body.into_response()
}

#[derive(Serialize, Deserialize)]
pub struct FileWrapper {
    file: String,
}

pub async fn put_file(
    Path(filename): Path<String>,
    Extension(state): Extension<State>,
    Json(data): Json<FileWrapper>,
) -> impl IntoResponse {
    println!("putting file");
    match SysFile::create(format!("{}/{}", state.directory, filename)) {
        Ok(mut file) => {
            file.write_all(data.file.as_bytes()).unwrap();
            StatusCode::OK
        }
        Err(_err) => StatusCode::INTERNAL_SERVER_ERROR,
    }
}

pub async fn del_file(
    Path(filename): Path<String>,
    Extension(state): Extension<State>,
) -> impl IntoResponse {
    let abs_filename = format!("{}/{}", state.directory, filename);

    match std::fs::remove_file(abs_filename) {
        Ok(()) => StatusCode::OK,
        Err(_err) => StatusCode::NOT_FOUND,
    }
}
