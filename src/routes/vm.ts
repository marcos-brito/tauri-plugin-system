import {  QuickJSContext, type QuickJSHandle } from "quickjs-emscripten";
import type { PluginInfo } from "./plugin";
import { invoke } from "@tauri-apps/api/core";
import { commandsRegister } from "./api";
import { newQuickJSWASMModuleFromVariant, newVariant, RELEASE_SYNC } from "quickjs-emscripten"
import wasmLocation from "@jitl/quickjs-wasmfile-release-sync/wasm?url"

export async function load() {
    const variant = newVariant(RELEASE_SYNC, {
        wasmLocation,
    })

    return await newQuickJSWASMModuleFromVariant(variant)
}

export async function runPlugin(info: PluginInfo): Promise<void> {
    const code: string = await invoke("read_file", { path: info.path })
    const quickJS = await load();
    const vm = quickJS.newContext();
    const api = API(vm)
    const print = printFn(vm)

    vm.setProp(vm.global, "API", api)
    vm.setProp(vm.global, "print", print)

    api.dispose()
    print.dispose()
    vm.evalCode(code).dispose()
    vm.dispose()
}

function printFn(vm: QuickJSContext): QuickJSHandle {
    return vm.newFunction("print", (...args) => {
        console.log(args.map(vm.dump))
    })
}

function API(vm: QuickJSContext): QuickJSHandle {
    const api = vm.newObject();
    const commands = commandsAPI(vm)

    vm.setProp(api, "commands", commands);
    commands.dispose()

    return api;
}

function commandsAPI(vm: QuickJSContext): QuickJSHandle {
    const commands = vm.newObject();
    const addCmd = vm.newFunction("addCmd", (cmd) => {
        commandsRegister.addCmd(vm.dump(cmd))
    })

    vm.setProp(commands, "addCmd", addCmd);
    addCmd.dispose()

    return commands;
}
