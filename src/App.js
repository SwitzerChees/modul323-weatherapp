import { diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";
import * as R from "ramda";

function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    const updates = update(msg, model);
    const isArray = R.type(updates) === "Array";
    model = isArray ? updates[0] : updates;
    const command = isArray ? updates[1] : null;
    httpEffects(dispatch, command);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

async function httpEffects(dispatch, command) {
  if (command === null) {
    return;
  }
  const { request, successMsg } = command;
  try {
    const response = await fetch(request.url);
    const data = await response.json();
    console.log(data);
    dispatch(successMsg(data));
  } catch (e) {
    console.log(e);
  }
}

export default app;
