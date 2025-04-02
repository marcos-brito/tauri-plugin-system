<script lang="ts">
    import { commandsRegister } from "./api";
    import { loadPlugins, execPlugins } from "./plugin";
</script>

<!-- Import plugins directly -->
{#await loadPlugins() then plugins}
    {#each plugins as plugin}
        <p>{plugin.sayHi()}</p>
        <p>{plugin.sayHiTo("Revan")}</p>
    {/each}
{/await}

<!-- Runs plugins on a VM -->
{#await execPlugins()}
    {#each commandsRegister.commands as cmd}
        <p>{cmd.name}</p>
        <p>{cmd.desc}</p>
    {/each}
{/await}
