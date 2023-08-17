// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs::File, io::{Write, Read}, env, path::PathBuf};
use tauri::{api::dialog::blocking::FileDialogBuilder, Manager};
use window_shadows::set_shadow;
use zip::{ZipWriter, write::FileOptions, ZipArchive};
use quick_xml::{de, se};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct Document {
  title: String,
  paragraph: String
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let main = app.get_window("main").unwrap();
      set_shadow(main, true).unwrap();
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![open_file, save_file])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command(async)]
async fn open_file(win: tauri::Window) -> (PathBuf, Vec<Document>) {
  let filepath = FileDialogBuilder::new()
    .set_parent(&win)
    .add_filter("NEX File", &["nex"])
    .pick_file().unwrap_or_default();

  let mut doc: Vec<Document> = Vec::new();
  //let mut fp = PathBuf::new();

  if filepath.is_file() {
    let file = File::open(&filepath).unwrap();
    let mut zip = ZipArchive::new(file).unwrap();
    

    for i in 0..zip.len() {
      let mut file = zip.by_index(i).unwrap();
      let mut buffer = String::new();
      file.read_to_string(&mut buffer).unwrap();

      let data: Document = de::from_str(&buffer).unwrap();
      doc.push(data);
    }
    
  }
  (filepath, doc)
}

#[tauri::command(async)]
async fn save_file(win: tauri::Window, data: (PathBuf, Vec<Document>)) {
  if data.0.is_file() {
    let file = File::create(data.0).unwrap();
    let mut zip = ZipWriter::new(file);

    for i in 0..data.1.len() {
      zip.start_file((i + 1).to_string() + ".xml", FileOptions::default()).unwrap();
      let s = se::to_string(&data.1[i]).unwrap();
      zip.write(s.as_bytes()).unwrap();
    }
    zip.finish().unwrap();
  } else {
    let filepath = FileDialogBuilder::new()
      .set_parent(&win)
      .add_filter("NEX File", &["nex"])
      .save_file().unwrap_or_default();

    if filepath.is_file() {
      let file = File::create(filepath).unwrap();
      let mut zip = ZipWriter::new(file);

      for i in 0..data.1.len() {
        zip.start_file((i + 1).to_string() + ".xml", FileOptions::default()).unwrap();
        let s = se::to_string(&data.1[i]).unwrap();
        zip.write(s.as_bytes()).unwrap();
      }
      zip.finish().unwrap();
    }
  }
  /*

    for i in 0..data.len() {
      zip.start_file((i + 1).to_string() + ".xml", FileOptions::default()).unwrap();
      zip.write(data[i].as_bytes()).unwrap();
    }
    zip.finish().unwrap();
  } */
}