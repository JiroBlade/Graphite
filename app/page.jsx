'use client'
import { useState, useEffect, useRef, forwardRef } from 'react';
import styles from './css/style.module.css'
import titlebar from './css/titlebar.module.css'
import dialog from './css/dialog.module.css'
import * as Tauri from './components/tauri'

import * as Tabs from './components/tabs';
import * as Dialog from './components/dialog';

export default function Home() {
    const [data, setData] = useState({ tabList: [], editorList: []})
    const [filepath, setFilepath] = useState(null)
    const [defaultTab, setDefaultTab] = useState("0")

    const tabsRef = useRef([])
    const tabsContentRef = useRef([])
    const editorsRef = useRef([])

    const Editor = forwardRef(({title, children, value}, ref) => {
        function rename(e) {
            tabsRef.current[value].textContent = e.target.value

            if(tabsRef.current[value].textContent == '') {
                tabsRef.current[value].textContent = 'Untitled Page'
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

        for(let i=0; i<tabsRef.current.length; i++) {
            tabsRef.current[i].setAttribute('data-active', false)
        }

        tabsContentRef.current[e.target.value].hidden = false
        e.target.setAttribute('data-active', true)
    }

    async function openFile() {
        const file = await Tauri.invoke('open_file')
        console.log(file)
        setFilepath(file[0])
        setData({
            tabList: file[1].map((item, i) =>
                <Tabs.Trigger key={i} className={styles.tabLink} ref={ed => tabsRef.current[i] = ed} value={i} active={false} onClick={e => openTab(e)}>{item.title}</Tabs.Trigger>),
            editorList: file[1].map((item, i) =>
                <Tabs.Content key={i} className={styles.tabsContent} ref={ed => tabsContentRef.current[i] = ed}><Editor title={item.title} value={i} ref={ed => editorsRef.current[i] = ed}>{item.paragraph}</Editor></Tabs.Content>)
        })
        
    }

    async function saveFile() {
        const fileData = []
        
        for(let i=0; i<editorsRef.current.length; i++) {
            fileData.push({
                title: editorsRef.current[i].children[0].value,
                paragraph: editorsRef.current[i].children[1].textContent
            })
        }

        await Tauri.invoke('save_file', { data: [filepath, fileData] })
    }

    function newPage() {
        /* setData({
            tabList: data.tabList.concat(
                <Tab key={data.tabList.length} active={false} value={data.tabList.length} ref={ed => tabsRef.current[data.tabList.length] = ed}>Untitled Page</Tab>),
            editorList: data.editorList.concat(
                <Tabs.Content key={data.editorList.length} ref={ed => tabsContentRef.current[data.editorList.length] = ed} value={data.editorList.length}></Tabs.Content>)
        }) */
    }

    const settingsWindow = useRef()
    const dialogRootRef = useRef()

    function hideDialog(e, toggle) {
        dialogRootRef.current.hidden = toggle
        settingsWindow.current.hidden = toggle
        
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

            <Tabs.Root style={{marginTop: '30px'}} defaultValue={defaultTab}>
                <div id={styles.sidebar}>
                    <button onClick={newPage} id={styles.newPage} disabled>New Page</button>
                    <Tabs.List id={styles.tabList}>
                        {data.tabList}
                    </Tabs.List>
                </div>
                {data.editorList}
            </Tabs.Root>
                            
            <Dialog.Root ref={dialogRootRef}>
                <Dialog.Window ref={settingsWindow} className={dialog.dialogWindow}>
                    <Dialog.Header title='Settings' onClick={e => hideDialog(e, true)}/>
                    <div className={dialog.dialogContent}>
                        <label for='titlebar'>Titlebar color:</label>
                        <input type='color' name='titlebar' value='#3b3b3b'/>
                    </div>
                </Dialog.Window>
                <Dialog.Window>

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