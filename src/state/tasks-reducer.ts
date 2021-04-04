import {TaskType} from '../Todolist';
import {v1} from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {TasksStateType} from '../App';
import {Dispatch} from "redux";
import {getTaskType, todoApi, UpdateTaskType} from "../api/todolist-api";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}
export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: getTaskType
}
export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    isDone: boolean
}
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}
type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | setTasksACType

const initialState: TasksStateType = {}
export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET-TODOS': {
            let copyState = {...state};
            action.todos.forEach((tl) => {
                copyState[tl.id] = []
            })
            return copyState;
        }
        case 'SET-TASKS': {
            let copyState = {...state};
            copyState[action.todoId] = action.tasks;
            return copyState
        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id != action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            // const newTask: TaskType = {
            //     id: v1(),
            //     title: action.title,
            //     isDone: false
            // }
            // debugger
            const tasks = stateCopy[action.task.todoListId];
            const newTasks = [action.task, ...tasks];
            stateCopy[action.task.todoListId] = newTasks;
            return stateCopy;

        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, isDone: action.isDone} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            // найдём нужную таску:
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}

export const addTaskAC = (task: getTaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', task}
}
export const changeTaskStatusAC = ( todolistId: string,taskId: string, isDone: boolean): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS',  todolistId, taskId,isDone}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}
export const setTasksAC = (todoId: string, tasks: Array<TaskType>) => {
    return {
        type: "SET-TASKS",
        todoId,
        tasks
    } as const
}
export type setTasksACType = ReturnType<typeof setTasksAC>

export const fetchTasksTC = (todoId: string) => (dispatch: Dispatch) => {
    todoApi.getTasks(todoId)
        .then((res) => {
            const tasks = res.data.items
            console.log(res.data)
            dispatch(setTasksAC(todoId, tasks))
        })
}

export const addTaskTC = (todolistId: string, taskTitile: string) => (dispatch: Dispatch) => {
    todoApi.createNewTask(todolistId, taskTitile)
        .then((res) => {
            // @ts-ignore
            const task: getTaskType = res.data.data.item
            dispatch(addTaskAC(task));
        })
}

export const updateTaskTaskStatusTC = (todolistId: string, taskId: string, isDone:boolean) => (dispatch: Dispatch,getState:()=>AppRootStateType) => {
   let state=getState();
   let task=state.tasks;
   let taskForCurrentTodolist=task[todolistId];
   //@ts-ignore
    const currentTask:UpdateTaskType=taskForCurrentTodolist.find((el)=>{
        return el.id===taskId
    })
   if(currentTask){
       todoApi.UpdateTask(todolistId, taskId, {
           status:isDone,
           title:currentTask.title,
           startDate:currentTask.startDate,
           priority:currentTask.priority,
           description:currentTask.description,
           deadline:currentTask.deadline
       })
           .then((res) => {
               const action = changeTaskStatusAC(todolistId,taskId, isDone );
               dispatch(action);
           })
   }

}
//UpdateTaskType