'use client'
import { CSSProperties, ReactElement, useCallback } from 'react'
import titlebar from '../css/titlebar.module.css'

export interface ElementProps {
    style?: CSSProperties
    role?: string
    state?: string
    children?: ReactElement[]
}

async function invoke(cmd: string, args?: Record<string, unknown>) {
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

export { invoke, WindowControl }