import Cookies from "js-cookie";
import prepareURLEncodedParams from "./helpers/prepareURLEncodedParams";

interface IAPIResponse {
  success: boolean;
  status: number;
  data: any;
}
class FetchService {
  authStatusCodes: number[] = [401, 403];
  authErrorURLs: string[] = []; //Auth API URL endpoints here

  private _fetchType: string;
  constructor(fetchTypeValue = "json") {
    this._fetchType = fetchTypeValue;
  }

  configureAuthorization(config: any) {
    let accessToken = "Bearer ";
    accessToken += Cookies.get("token");
    config.headers["Authorization"] = accessToken;
  }
  setHeader(config: any) {
    config.headers = {};
  }
  setDefaultHeaders(config: any) {
    config.headers = {
      "Content-Type": "application/json",
    };
  }

  checkToLogOutOrNot(path: string) {
    return this.authErrorURLs.some((arrayUrl: string) =>
      path.includes(arrayUrl)
    );
  }
  isAuthRequest(path: string) {
    return this.authErrorURLs.includes(path);
  }

  async hit(...args: any): Promise<IAPIResponse> {
    let [path, config] = args;
    this.setDefaultHeaders(config);

    if (!this.isAuthRequest(path)) {
      this.configureAuthorization(config);
    }

    // request interceptor starts

    let url = import.meta.env.VITE_PUBLIC_API_URL + path;

    const response: any = await fetch(url, config);

    if (response?.status == 200 || response?.status == 201) {
      if (this._fetchType == "response") {
        return {
          success: true,
          status: response.status,
          data: response,
        };
      } else {
        return {
          success: true,
          status: response.status,
          data: await response.json(),
        };
      }
    } else if (
      this.authStatusCodes.includes(response.status) &&
      !this.checkToLogOutOrNot(path)
    ) {
      setTimeout(() => {
        Cookies.remove("token");
        window.location.href = "/";
      }, 1000);
      return {
        success: false,
        status: response.status,
        data: await response.json(),
      };
    } else {
      return {
        status: response?.status,
        success: false,
        data: await response.json(),
      };
    }
  }
  async post(url: string, payload?: any) {
    return await this.hit(url, {
      method: "POST",
      body: payload ? JSON.stringify(payload) : undefined,
    });
  }
  async postFormData(url: string, file?: any) {
    return await this.hit(url, {
      method: "POST",
      body: file,
    });
  }

  async get(url: string, queryParams = {}) {
    if (Object.keys(queryParams).length) {
      url = prepareURLEncodedParams(url, queryParams);
    }
    return await this.hit(url, {
      method: "GET",
    });
  }
  async delete(url: string, payload = {}) {
    return this.hit(url, {
      method: "DELETE",
      body: JSON.stringify(payload),
    });
  }
  async deleteWithOutPayload(url: string) {
    return this.hit(url, {
      method: "DELETE",
    });
  }
  async put(url: string, payload = {}) {
    return this.hit(url, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }
  async patch(url: string, payload = {}) {
    return this.hit(url, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }
}
// for app search
export const $fetch = new FetchService();
