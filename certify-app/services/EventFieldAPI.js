import api from "./configs/AxiosConfig";
import { defineCancelApiObject } from "./configs/AxiosUtils";

export const EventFieldAPI = {
  delete: async function (eventFieldId, cancel = false) {
    return api.request({
      url: `/EventField/${eventFieldId}`,
      method: "DELETE",
      signal: cancel
        ? cancelApiObject[this.delete.name].handleRequestCancellation().signal
        : undefined,
    });
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(EventFieldAPI);
