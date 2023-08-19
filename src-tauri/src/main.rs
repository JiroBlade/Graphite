// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs::File, io::{Write, Read}, env, path::PathBuf};
use tauri::{api::dialog::blocking::FileDialogBuilder, Manager};
use window_shadows::set_shadow;
use zip::{ZipWriter, write::FileOptions, ZipArchive};
use quick_xml::{de, se};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct Root {
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
async fn open_file(win: tauri::Window) -> (PathBuf, serde_json::Value, Vec<Root>) {
  let filepath = FileDialogBuilder::new()
    .set_parent(&win)
    .add_filter("NEX File", &["nex"])
    .pick_file().unwrap_or_default();

  let mut doc: Vec<Root> = Vec::new();
  let fp = &filepath;

  if filepath.is_file() {
    let file = File::open(&filepath).unwrap();
    let mut zip = ZipArchive::new(file).unwrap();
    
    for i in 0..zip.len() {
      let mut buf = String::new();

      let s = "chapters/".to_owned() + &(i + 1).to_string() + ".xml";
      let file = zip.by_name(&s);

      if file.is_ok() {
        file.unwrap().read_to_string(&mut buf).unwrap();

        let data: Root = de::from_str(&buf).unwrap();
        doc.push(data);
      }
    }
  }
  (fp.to_path_buf(), read_config(fp.to_path_buf()), doc)
  }

fn read_config(filepath: PathBuf) -> serde_json::Value {
  let file = File::open(filepath).unwrap();
  let mut zip = ZipArchive::new(file).unwrap();
  let config = zip.by_name("settings.json").unwrap();

  let json: serde_json::Value = serde_json::from_reader(config).unwrap();
  json
}

#[tauri::command(async)]
async fn save_file(_win: tauri::Window, data: (PathBuf, serde_json::Value, Vec<Root>)) {
  let options = FileOptions::default();

  if data.0.is_file() {
    let file = File::create(data.0).unwrap();
    let mut zip = ZipWriter::new(file);

    zip.start_file("settings.json", options).unwrap();
    let settings = serde_json::to_string_pretty(&data.1).unwrap();
    zip.write(settings.as_bytes()).unwrap();
    zip.finish().unwrap();

    zip.add_directory("chapters/", options).unwrap();

    for i in 0..data.2.len() {
      zip.start_file("chapters/".to_owned() + &(i + 1).to_string() + ".xml", options).unwrap();
      let s = se::to_string(&data.1[i]).unwrap();
      zip.write(s.as_bytes()).unwrap();
    }
    zip.finish().unwrap();
  }
  /* if data.0.is_file() {

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
  } */
}