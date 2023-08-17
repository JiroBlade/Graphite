import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { ElementProps } from "./tauri";

interface TabsRootProps extends ElementProps {
    defaultValue: string
}

const Root = forwardRef<HTMLDivElement, TabsRootProps>((props: TabsRootProps, ref) => {
    const { defaultValue, ...listProps } = props

    return <div {...listProps} ref={ref}/>
})

interface TabsListProps extends ElementProps {

}

const List = forwardRef<HTMLDivElement, TabsListProps>((props: TabsListProps, ref) => {
    const { ...listProps } = props
    return <div {...listProps} ref={ref}/>
})

interface TabsTriggerProps extends ElementProps {
    active: boolean
    value: string
    onClick: any
}

const Trigger = forwardRef<HTMLButtonElement, TabsTriggerProps>((props: TabsTriggerProps, forwardedRef) => {
    const { active, value, onClick, ...listProps } = props
    const ref = useRef<HTMLButtonElement>()

    useImperativeHandle(forwardedRef, () => ref.current as HTMLButtonElement)

    return <button {...listProps} ref={ref} value={value} data-active={active} onClick={onClick}></button>
})

interface TabsContentProps extends ElementProps {
    
}

const Content = forwardRef<HTMLDivElement, TabsContentProps>((props: TabsContentProps, ref) => {
    const { ...listProps } = props
    return <div {...listProps} ref={ref} hidden/>
})

export { Root, List, Trigger, Content }