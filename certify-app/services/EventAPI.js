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
  checkinEnabledMode: async function (event, cancel = false) {
    return api.request({
      url: `/Event/CheckinEnabledMode`,
      method: "PUT",
      data: event,
      signal: cancel
        ? cancelApiObject[
            this.checkinEnabledMode.name
          ].handleRequestCancellation().signal
        : undefined,
    });
  },
  downloadCertificates: async function (eventId, cancel = false) {
    return api.request({
      url: `/Event/Certificado/Download/${eventId}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[
            this.downloadCertificates.name
          ].handleRequestCancellation().signal
        : undefined,
    });
  },
  sendCertificates: async function (eventId, cancel = false) {
    return api.request({
      url: `/Event/Certificado/Send/${eventId}`,
      method: "POST",
      signal: cancel
        ? cancelApiObject[
            this.sendCertificates.name
          ].handleRequestCancellation().signal
        : undefined,
    });
  },
  getFields: async function (eventId, cancel = false) {
    return api.request({
      url: `/Event/${eventId}/EventField`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getFields.name].handleRequestCancellation()
            .signal
        : undefined,
    });
  },
  saveField: async function (eventField, cancel = false) {
    return api.request({
      url: `/Event/EventField`,
      method: "POST",
      data: eventField,
      signal: cancel
        ? cancelApiObject[this.saveField.name].handleRequestCancellation()
            .signal
        : undefined,
    });
  },
  reorderFields: async function (reorderFields, eventId, cancel = false) {
    return api.request({
      url: `/Event/${eventId}/EventField/Reorder`,
      method: "PUT",
      data: reorderFields,
      signal: cancel
        ? cancelApiObject[this.saveField.name].handleRequestCancellation()
            .signal
        : undefined,
    });
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(EventAPI);
