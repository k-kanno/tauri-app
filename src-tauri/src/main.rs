#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{fs, io::Write};
use serde::{Serialize, Deserialize};
use dotenvy::dotenv;
use std::env;

#[derive(Serialize, Deserialize, Debug)]
struct Ticket {
    key: String,
    groupName: String,
    contents: String,
    itemType: String
}

/**① 指定されたパスのファイル読み込み */
fn read_file(path: String) -> String {
  std::fs::read_to_string(path).expect("could not read file")
}

fn read_file_path() -> String {
  let tickets_file_path_key = "TICKETS_FILE_PATH";
  dotenv().ok();
  env::var(tickets_file_path_key).unwrap()
}

/**② tauriのコマンド。ファイルの中身を改行で区切りVecにして返す。 */
#[tauri::command]
fn create_ticket(path: String) -> Vec<String>{
    println!("create ticket");
    let tickets = read_file(path);
    tickets.lines().map(|s|s.to_string()).collect()
}

/**tauriのコマンド。渡されたチケットの配列をJSONで保存する。 */
#[tauri::command]
fn save_ticket(tickets: Vec<Ticket>){
    println!("save ticket");
    let serialized: String = serde_json::to_string(&tickets).unwrap();
    println!("{}", serialized);
    let mut file = fs::File::create(read_file_path()).unwrap();
    file.write_all(serialized.as_bytes()).unwrap();
}

/**tauriのコマンド。JSONファイルのチケット一覧を返却する。 */
#[tauri::command]
fn read_ticket() -> Vec<Ticket>{
    println!("read ticket");
    let ticket_json = fs::read_to_string(read_file_path()).unwrap();
    println!("{}", ticket_json);
    let ticket: Vec<Ticket> = serde_json::from_str(&ticket_json).unwrap();
    return ticket;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_ticket, save_ticket, read_ticket])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
