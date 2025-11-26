import appState from "./appState";

/**
 * Show success message.
 * @param msg Message content.
 */
function notifySuccess(msg : string) {
    appState.msgs.next({
        severity : "success",
        summary : "Operation success.",
        detail : msg,
        life : 3000
    })
}

/**
 * Show failure message.
 * @param msg Message content.
 */
function notifyFailure(msg: string) {
    appState.msgs.next({
        severity : "warn",
        summary : "Operation failure.",
        detail : msg,
        life : 3000
    })
}

//
export {
    notifySuccess,
    notifyFailure
}