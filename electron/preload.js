// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// import { contextBridge, ipcRenderer } from "electron";
//
// contextBridge.exposeInMainWorld("ipcRenderer", withPrototype(ipcRenderer));
//
// function withPrototype(obj) {
// 	const protos = Object.getPrototypeOf(obj);
//
// 	for (const [key, value] of Object.entries(protos)) {
// 		if (Object.prototype.hasOwnProperty.call(obj, key)) continue;
//
// 		if (typeof value === "function") {
// 			obj[key] = function (...args) {
// 				return value.call(obj, ...args);
// 			};
// 		} else {
// 			obj[key] = value;
// 		}
// 	}
// 	return obj;
// }
