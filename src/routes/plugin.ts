import { path } from "@tauri-apps/api";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { runPlugin } from "./vm";

// Only used for `loadPlugins`. `execPlugins` needs the actual
// source code
export interface Plugin {
    sayHi(): string;
    sayHiTo(name: string): string;
}

type Manifest = {
    name: string;
    author: string;
    repo: string;
};

export type PluginInfo = {
    path: string;
    manifest: Manifest;
};

export async function loadPlugins(): Promise<Array<Plugin>> {
    const pluginsInfo: Array<PluginInfo> = await invoke("find_plugins", {
        configDir: await path.appConfigDir(),
    });

    let plugins: Array<Plugin> = [];
    for (const info of pluginsInfo) {
        const url = convertFileSrc(info.path);
        const {default: plugin} = await import(url);
        plugins.push(plugin)
    }

    return plugins;
}

export async function execPlugins(): Promise<void> {
    const pluginsInfo: Array<PluginInfo> = await invoke("find_plugins", {
        configDir: await path.appConfigDir(),
    });

    for (const info of pluginsInfo) {
        await runPlugin(info);
    }
}
