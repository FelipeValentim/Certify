import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
  WebViewNavigationEvent,
  WebViewSource,
} from "react-native-webview/lib/WebViewTypes";

export type RenderType = "GOOGLE_READER" | "GOOGLE_DRIVE_VIEWER";

export interface Source {
  uri?: string;
  base64?: string;
  headers?: { [key: string]: string };
}

export interface Props {
  source: Source;
  style?: View["props"]["style"];
  webviewStyle?: WebView["props"]["style"];
  webviewProps?: WebView["props"];
  noLoader?: boolean;
  useGoogleDriveViewer: boolean;
  useGoogleReader?: boolean;
  onLoad?: (event: WebViewNavigationEvent) => void;
  onLoadEnd?: (event: WebViewNavigationEvent | WebViewErrorEvent) => void;
  onError?: (event: WebViewErrorEvent | WebViewHttpErrorEvent | string) => void;
}

const originWhitelist = ["http://*", "https://*"];

const getGoogleReaderUrl = (url: string) =>
  `https://docs.google.com/viewer?url=${url}`;
const getGoogleDriveUrl = (url: string) =>
  `https://drive.google.com/viewerng/viewer?embedded=true&url=${url}`;

const Loader = () => (
  <View
    style={{
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <ActivityIndicator size="large" />
  </View>
);

const validate = ({
  onError,
  renderType,
  source,
}: {
  onError: (event: WebViewErrorEvent | WebViewHttpErrorEvent | string) => void;
  renderType: RenderType;
  source: Source;
}) => {
  if (!renderType || !source) {
    onError("source is undefined");
  } else if (
    (renderType === "GOOGLE_READER" || renderType === "GOOGLE_DRIVE_VIEWER") &&
    (!source.uri || !source.uri.startsWith("http"))
  ) {
    onError(
      `source.uri is undefined or not started with http, file or content source.uri = ${source.uri}`
    );
  }
};

const init = async ({
  renderType,
  setReady,
}: {
  renderType?: RenderType;
  setReady: Dispatch<SetStateAction<boolean>>;
  source: Source;
}) => {
  try {
    switch (renderType!) {
      case "GOOGLE_DRIVE_VIEWER": {
        break;
      }

      default:
        break;
    }

    setReady(true);
  } catch (error) {
    console.error(error);
  }
};

const getRenderType = ({
  useGoogleDriveViewer,
  useGoogleReader,
}: {
  source: Source;
  useGoogleDriveViewer?: boolean;
  useGoogleReader?: boolean;
}) => {
  if (useGoogleReader) {
    return "GOOGLE_READER";
  }

  if (useGoogleDriveViewer) {
    return "GOOGLE_DRIVE_VIEWER";
  }

  return undefined;
};

const getWebviewSource = ({
  source,
  renderType,
  onError,
}: {
  source: Source;
  renderType?: RenderType;
  onError: (event: WebViewErrorEvent | WebViewHttpErrorEvent | string) => void;
}): WebViewSource | undefined => {
  const { uri, headers } = source;

  switch (renderType!) {
    case "GOOGLE_READER":
      return { uri: getGoogleReaderUrl(uri!) };
    case "GOOGLE_DRIVE_VIEWER":
      return { uri: getGoogleDriveUrl(uri || "") };
    default: {
      onError!("Unknown RenderType");
      return undefined;
    }
  }
};

const PdfViewer = ({
  source,
  style,
  webviewStyle,
  webviewProps,
  noLoader = false,
  useGoogleReader,
  useGoogleDriveViewer = true,
  onLoad,
  onLoadEnd,
  onError = console.error,
}: Props) => {
  const [ready, setReady] = useState<boolean>(false);
  const [renderType, setRenderType] = useState<RenderType | undefined>(
    undefined
  );
  const [renderedOnce, setRenderedOnce] = useState<boolean>(false);

  useEffect(() => {
    if (renderType) {
      console.debug(renderType);
      validate({ onError, renderType, source });
      init({ renderType, setReady, source });
    }
  }, [renderType]);

  useEffect(() => {
    if (source.uri || source.base64) {
      setReady(false);
      setRenderType(
        getRenderType({ source, useGoogleDriveViewer, useGoogleReader })
      );
    }
  }, [source.uri, source.base64]);

  const sourceToUse = useMemo(() => {
    if (!!onError && renderType && source) {
      return getWebviewSource({ onError, renderType, source });
    }
    return undefined;
  }, [getWebviewSource, onError, renderType, source]);

  const isAndroid = useMemo(() => Platform.OS === "android", [Platform]);

  return ready ? (
    <View style={[styles.container, style]}>
      <WebView
        {...{
          onError,
          onHttpError: onError,
          onLoad: (event) => {
            setRenderedOnce(true);
            if (onLoad) {
              onLoad(event);
            }
          },
          onLoadEnd,
          originWhitelist,
          source: renderedOnce || !isAndroid ? sourceToUse : { uri: undefined },
          style: [styles.webview, webviewStyle],
        }}
        allowFileAccess={isAndroid}
        allowFileAccessFromFileURLs={isAndroid}
        allowUniversalAccessFromFileURLs={isAndroid}
        scalesPageToFit={Platform.select({ android: false })}
        mixedContentMode={isAndroid ? "always" : undefined}
        sharedCookiesEnabled={false}
        startInLoadingState={!noLoader}
        renderLoading={() => (noLoader ? <View /> : <Loader />)}
        {...webviewProps}
      />
    </View>
  ) : (
    <View style={styles.loaderContainer}>{!noLoader && <Loader />}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  webview: {
    flex: 1,
  },
});

export default PdfViewer;
