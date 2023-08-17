import { CSSProperties, useCallback } from 'react'
import titlebar from '../css/titlebar.module.css'

type InvokeArgs = Record<string, unknown>

export interface ElementProps {
    style?: CSSProperties
}

async function invoke(cmd: string, args?: InvokeArgs) {
    const { invoke } = await import('@tauri-apps/api')
    return invoke(cmd, args)
}

function WindowControl() {
    const minimize = useCallback(async() => {
        const { appWindow } = await import('@tauri-apps/api/window')
        appWindow.minimize()
    },[])

    const toggleMaximize = useCallback(async() => {
        const { appWindow } = await import('@tauri-apps/api/window')
        appWindow.toggleMaximize()
    }, [])

    const close = useCallback(async() => {
        const { appWindow } = await import('@tauri-apps/api/window')
        appWindow.close()
    }, [])

    return(
        <div id={titlebar.windowControl}>
            <button onClick={minimize}></button>
            <button onClick={toggleMaximize}></button>
            <button onClick={close}></button>
        </div>
    )
}

function Version() {
    const getVersion = useCallback(async() => {
        const { getVersion } = await import('@tauri-apps/api/app')
        const version = await getVersion()
        alert('Version: ' + version)
    }, [])

    return <button onClick={getVersion}>Version</button>
}

export { invoke, WindowControl, Version }