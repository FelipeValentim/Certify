import api from "./configs/AxiosConfig";
import { defineCancelApiObject } from "./configs/AxiosUtils";

export const EventTemplateAPI = {
  uploadTemplate: async function (file, eventId, cancel = false) {
    return api.request({
      url: `/EventTemplate/Upload/${eventId}`,
      method: "POST",
      data: file,
      signal: cancel
        ? cancelApiObject[this.uploadTemplate.name].handleRequestCancellation()
            .signal
        : undefined,
    });
  },
  removeTemplate: async function (eventId, cancel = false) {
    return api.request({
      url: `/EventTemplate/Remove/${eventId}`,
      method: "DELETE",
      signal: cancel
        ? cancelApiObject[this.removeTemplate.name].handleRequestCancellation()
            .signal
        : undefined,
    });
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(EventTemplateAPI);
