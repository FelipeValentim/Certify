import api from "./configs/AxiosConfig";
import { defineCancelApiObject } from "./configs/AxiosUtils";

export const EventAPI = {
  newEvent: async function (event, cancel = false) {
    return api.request({
      url: `/Event/NewEvent`,
      method: "POST",
      data: { ...event },
      signal: cancel
        ? cancelApiObject[this.newEvent.name].handleRequestCancellation().signal
        : undefined,
    });
  },
  getAll: async function (cancel = false) {
    return api.request({
      url: `/Event/GetEvents`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal
        : undefined,
    });
  },
  get: async function (eventoId, cancel = false) {
    return api.request({
      url: `/Event/GetEvent/${eventoId}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.get.name].handleRequestCancellation().signal
        : undefined,
    });
  },
  delete: async function (eventoId, cancel = false) {
    return api.request({
      url: `/Event/Delete/${eventoId}`,
      method: "DELETE",
      signal: cancel
        ? cancelApiObject[this.delete.name].handleRequestCancellation().signal
        : undefined,
    });
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(EventAPI);
