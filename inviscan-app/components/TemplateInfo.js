import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Image, Modal } from "react-native";
import ButtonLoading from "@/components/common/ButtonLoading";
import Question from "@/assets/images/undraw_question.svg";
import {
  CustomScrollView,
  H3,
  MutedText,
} from "@/components/common/CustomElements";
import { redColor, screenHeight, screenWidth } from "@/constants/Default";
import ModalContainer from "@/components/common/ModalContainer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ImageViewer from "react-native-image-zoom-viewer";

const TemplateInfo = ({ visible, toggle }) => {
  if (!visible) return null;
  const { top, bottom } = useSafeAreaInsets();
  const [imageZoom, setImageZoom] = useState(false);

  const images = [
    {
      url: "",
      props: {
        // Or you can set source directory.
        source: require("@/assets/images/certificate_example.png"),
      },
    },
  ];

  const styles = StyleSheet.create({
    innerContainer: {
      height: screenHeight - top - bottom - 30,
      padding: 20,
      gap: 20,
    },
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    message: {
      textAlign: "start",
    },
    btn: {
      borderWidth: 2,
    },
    title: {
      textAlign: "center",
    },
    rounded: {
      borderRadius: 20,
    },
  });

  return (
    <ModalContainer
      visible={visible}
      toggle={toggle}
      overlayStyle={{ bottom: 10 }}
    >
      <View style={[styles.innerContainer, styles.rounded]}>
        <CustomScrollView contentContainerStyle={{ gap: 20 }}>
          <View style={styles.imageContainer}>
            <Question height={screenHeight / 6} />
          </View>
          <H3 style={styles.title}>Informações importantes</H3>
          <MutedText style={styles.message}>
            Este modelo DOC/DOCX utiliza placeholders para personalizar o
            conteúdo automaticamente. Basta enviar o template com os seguintes
            marcadores, e eles serão substituídos pelas informações específicas,
            gerando os certificados finais prontos para uso:
            {"\n"}
            {"\n"}
            {"{nome}"} - Nome do convidado
            {"\n"}
            {"{data}"} - Data do evento
            {"\n"}
            {"{tipoconvidado}"} - Tipo de convidado
            {"\n"}
            {"{evento}"} - Nome do evento
            {"\n"}
            {"{horarioinicial}"} - Horário inicial
            {"\n"}
            {"{horariofinal}"} - Horário final
            {"\n"} {"\n"}
            Aqui está um exemplo de como deve ficar. Vale ressaltar que apenas{" "}
            {"{nome}"} é obrigatório:
          </MutedText>

          <Pressable onPress={() => setImageZoom(true)}>
            <Image
              style={{
                width: "100%",
                height: undefined,
                resizeMode: "contain",
                aspectRatio: 1,
              }}
              source={require("@/assets/images/certificate_example.png")}
            />
          </Pressable>
        </CustomScrollView>

        <ButtonLoading
          onPress={toggle}
          loadingColor="#000"
          color="#000"
          backgroundColor="transparent"
          style={[styles.btn, styles.cancelBtn]}
        >
          Entendido
        </ButtonLoading>
      </View>
      <Modal visible={imageZoom} transparent={true}>
        <ImageViewer
          imageUrls={images}
          onClick={() => setImageZoom(false)}
          saveToLocalByLongPress={false}
          enableSwipeDown
          onSwipeDown={() => setImageZoom(false)}
        />
      </Modal>
    </ModalContainer>
  );
};

export default TemplateInfo;
