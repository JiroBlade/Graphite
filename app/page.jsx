'use client'
import { useState, useEffect, useRef, forwardRef, createContext } from 'react';
import styles from './css/style.module.css'
import titlebar from './css/titlebar.module.css'
import dialog from './css/dialog.module.css'
import * as Tauri from './components/tauri'

import * as Tabs from './components/tabs';
import * as Dialog from './components/dialog';
import * as Settings from './components/settings'

export const TabContext = createContext()

export default function Home() {
    const [data, setData] = useState({ tabList: [], editorList: []})
    const [filepath, setFilepath] = useState(null)
    const [defaultTab, setDefaultTab] = useState(null)

    const tabsTriggerRef = useRef([])
    const tabsContentRef = useRef([])
    const editorsRef = useRef([])

    const Editor = forwardRef(({title, children, value}, ref) => {
        function rename(e) {
            
            tabsTriggerRef.current[value].textContent = e.target.value

            if(tabsTriggerRef.current[value].textContent == '') {
                tabsTriggerRef.current[value].textContent = 'Untitled Page'
            }
        }

        return(
            <div ref={ref}>
                <input defaultValue={title} className={styles.title} onInput={e => rename(e)}/>
                <div contentEditable suppressContentEditableWarning>
                    {children}
                </div>
            </div>
        )
    })

    function openTab(e) {
        for(let i=0; i<tabsContentRef.current.length; i++) {
            tabsContentRef.current[i].hidden = true
        }

        for(let i=0; i<tabsTriggerRef.current.length; i++) {
            tabsTriggerRef.current[i].setAttribute('data-active', false)
        }

        tabsContentRef.current[e.target.value].hidden = false
        e.target.setAttribute('data-active', true)
    }

    async function openFile() {
        const file = await Tauri.invoke('open_file')
        setFilepath(file[0])
        setDefaultTab(file[1].defaultTab)
        setData({
            tabList: file[2].map((item, i) =>
                <Tabs.Trigger key={i} className={styles.tabLink} name={item.title} ref={ed => tabsTriggerRef.current[i] = ed} value={i} active={false} onClick={e => openTab(e)}/>),
            editorList: file[2].map((item, i) =>
                <Tabs.Content key={i} className={styles.tabsContent} ref={ed => tabsContentRef.current[i] = ed}>
                    <Editor title={item.title} value={i} ref={ed => editorsRef.current[i] = ed}>{item.paragraph}</Editor>
                </Tabs.Content>)
        })
    }

    useEffect(() => {
        if(filepath != null) {
            tabsTriggerRef.current[defaultTab].setAttribute('data-active', true)
            tabsContentRef.current[defaultTab].hidden = false
        }
    })

    async function saveFile() {
        const fileData = []
        const settings = {
            defaultTab
        }

        for(let i=0; i<tabsTriggerRef.current.length; i++) {
            if(tabsTriggerRef.current[i].getAttribute('data-active') == 'true') {
                settings.defaultTab = i
                break
            }
        }
        
        for(let i=0; i<editorsRef.current.length; i++) {
            fileData.push({
                title: editorsRef.current[i].children[0].value,
                paragraph: editorsRef.current[i].children[1].textContent
            })
        }

        await Tauri.invoke('save_file', { data: [filepath, settings, fileData] })
    }

    function newPage() {
        setData({
            tabList: data.tabList.concat(
                <Tabs.Trigger key={data.tabList.length} name='Untitled Page' className={styles.tabLink} ref={ed => tabsTriggerRef.current[data.tabList.length] = ed} value={data.tabList.length} active={false} onClick={e => openTab(e)}/>),
            editorList: data.editorList.concat(
                <Tabs.Content key={data.editorList.length} className={styles.tabsContent} ref={ed => tabsContentRef.current[data.editorList.length] = ed}>
                    <Editor title={''} value={data.editorList.length} ref={ed => editorsRef.current[data.editorList.length] = ed}></Editor>
                </Tabs.Content>)
        })
    }

    function openContextMenu(e) {
        e.preventDefault()
    }

    const dialogRootRef = useRef()
    const dialogWindowRef = useRef([])

    function hideDialog(e, toggle) {
        dialogRootRef.current.hidden = toggle
        //settingsWindow.current.hidden = toggle
        
    }

    return(
        <>
            <div data-tauri-drag-region id={titlebar.titlebar}>
                <div>
                    <button onClick={openFile}>Open</button>
                    <button onClick={saveFile}>Save</button>
                    <Dialog.Trigger>Export</Dialog.Trigger>
                    <Dialog.Trigger onClick={e => hideDialog(e, false)}>Settings</Dialog.Trigger>
                    <Tauri.Version/>
                </div>
                <div data-tauri-drag-region id={styles.windowTitle}>
                    {filepath}
                </div>
                <Tauri.WindowControl/>
            </div>

            <Tabs.Root style={{marginTop: '30px'}} value={defaultTab}>
                <div id={styles.sidebar}>
                    <button onClick={newPage} id={styles.newPage}>New Page</button>
                    <Tabs.List id={styles.tabList}>
                        {data.tabList}
                    </Tabs.List>
                </div>
                {data.editorList}
            </Tabs.Root>
                            
            <Dialog.Root ref={dialogRootRef}>
                <Dialog.Window className={dialog.dialogWindow}>
                    <Dialog.Header title='Settings' onClick={e => hideDialog(e, true)}/>
                    <div className={dialog.dialogContent}>
                        
                    </div>
                </Dialog.Window>
                <Dialog.Window>
                    <Dialog.Header title='Export'/>
                </Dialog.Window>
            </Dialog.Root>
        </>
    )
}

/*
    function useContextMenu(e, k) {
        e.preventDefault()
        setClicked(true)
        setPos({ x: e.pageX, y: e.pageY })
        setTabItemKey(k)
    }

    function openContextMenu() {
        const [clicked, setClicked] = useState(false)
        const [pos, setPos] = useState({ x: 0, y: 0 })

        useEffect(() => {
            const handleClick = () => setClicked(false)
            document.addEventListener('click', handleClick)
            return () => {
                document.removeEventListener('click', handleClick)
            }
        }, [])

        return { clicked, setClicked, pos, setPos }
    }

    function ContextMenu() {
        function deleteChapter() {
            setData({
                tabList: data.tabList.filter((item, i) => i != tabItemKey),
                editorList: data.editorList.filter((item, i) => i != tabItemKey)
            })

            editorsRef.current.filter((item, i) => i != tabItemKey)
            console.log(editorsRef.current[tabItemKey])
        }

        return(
            <>
                <div className={styles.contextmenu} style={{top: pos.y, left: pos.x}}>
                    <button onClick={deleteChapter}>Delete</button>
                </div>
            </>
        )
    }
    /* activePage.addEventListener('keydown', e => {
    switch(e.key) {
        case 'Backspace':
            const sel = window.getSelection();
            if(sel.anchorOffset == 0 && activePage.childElementCount == 1 && activePage.querySelector('p').textContent == '') {
                e.preventDefault();
            }
    }
})
} */