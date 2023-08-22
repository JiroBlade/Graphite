import { forwardRef } from "react";
import { ElementProps } from "./tauri";
import { TabContext } from "../page";
import styles from '../css/style.module.css'

interface TabsProps extends ElementProps {
    defaultValue?: string
}

interface TabsRootProps extends TabsProps {
    
}

const Root = forwardRef<HTMLDivElement, TabsRootProps>((props: TabsRootProps, ref) => {
    const { defaultValue, children, ...listProps } = props

    return(
        <TabContext.Provider value={defaultValue}>
            <div {...listProps} ref={ref}>{children}</div>
        </TabContext.Provider>)
})

interface TabsListProps extends TabsProps {
    
}

const List = forwardRef<HTMLDivElement, TabsListProps>((props: TabsListProps, ref) => {
    const { children, ...listProps } = props

    return <div {...listProps} ref={ref}>{children}</div>
})

interface TabsTriggerProps extends TabsProps {
    name: string
    active: boolean
    value: string
    onClick: any
    onCM: any
}

const Trigger = forwardRef<HTMLButtonElement, TabsTriggerProps>((props: TabsTriggerProps, ref) => {
    const { active, value, onClick, children, onCM, ...listProps } = props

    return(
        <button {...listProps} ref={ref} value={value} data-active={active} onClick={onClick} onContextMenu={onCM}>
            <span>{children}</span>
        </button>)
})

interface TabsContentProps extends TabsProps {
    
}

const Content = forwardRef<HTMLDivElement, TabsContentProps>((props: TabsContentProps, ref) => {
    const { ...listProps } = props
    return <div {...listProps} ref={ref} hidden/>
})

export { Root, List, Trigger, Content }