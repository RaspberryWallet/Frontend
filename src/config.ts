export const serverHttpUrl =
    process.env.REACT_APP_STAGE === 'production' ?
        window.location.origin :
        "";// (window.location.protocol + "//" + window.location.hostname + ":9080");

export const serverWsUrl = "ws://" +
    (process.env.REACT_APP_STAGE === 'production' ?
        window.location.host :
        window.location.hostname + ":9080");
