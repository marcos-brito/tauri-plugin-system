use std::fs;
use std::path::PathBuf;

const PLUGIN_FILE: &str = "plugin.js";
const MANIFEST_FILE: &str = "manifest.json";

#[derive(serde::Deserialize, serde::Serialize)]
struct Manifest {
    name: String,
    author: String,
    repo: String,
}

#[derive(serde::Deserialize, serde::Serialize)]
struct Plugin {
    path: PathBuf,
    manifest: Manifest,
}

#[tauri::command]
fn read_file(path: PathBuf) -> Result<String, String> {
    Ok(fs::read_to_string(path).map_err(|e| e.to_string())?)
}

#[tauri::command]
fn find_plugins(config_dir: PathBuf) -> Result<Vec<Plugin>, String> {
    Ok(fs::read_dir(config_dir)
        .map_err(|err| err.to_string())?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let manifest = fs::read_to_string(entry.path().join(MANIFEST_FILE))
                .ok()
                .and_then(|contents| serde_json::from_str(&contents).ok())?;

            Some(Plugin {
                path: entry.path().join(PLUGIN_FILE),
                manifest,
            })
        })
        .collect())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![read_file, find_plugins])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
