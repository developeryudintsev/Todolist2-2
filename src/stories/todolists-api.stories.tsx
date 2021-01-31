import React, {useEffect, useState} from 'react'
import axios from "axios";
import {todoApi} from "../api/todolist-api";

export default {
    title: 'API'
}
const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '0e5dc50f-7e9f-4eda-9157-a63c5026aaad'
    }
}


export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists', settings)
        todoApi.getTodos()
            .then((res) => setState(res.data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', {title: 'React'}, settings)
        todoApi.createTodos().then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null);
    // let todolistID='9b105ec2-5aa5-4edd-a0ee-31d8e505f6c2';
    useEffect(() => {
        todoApi.DeleteTodos()
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null);
    // let todolistID='555e0458-b266-411d-95c8-aa539c95eb01';
    useEffect(() => {
        todoApi.UpdateTodos()
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
