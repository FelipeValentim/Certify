import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Pressable,
  Image,
  Text,
  TouchableOpacity,
  PanResponder,
  StyleProp,
  TextInputProps,
  ViewStyle,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { format, parse } from "date-fns";
import { Picker } from "@react-native-picker/picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faEye,
  faEyeSlash,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { faImages, faCalendar } from "@fortawesome/free-regular-svg-icons";
import * as SelectImage from "expo-image-picker";
import { mutedColor, primaryColor } from "@/constants/Default";
import { CustomScrollView, MutedText } from "./CustomElements";
import ModalContainer from "./ModalContainer";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br"; // importa o locale pt-br
import Svg, { Circle, Text as SvgText } from "react-native-svg";

dayjs.locale("pt-br"); // define como padrão
// Hook com tipagem
const useAnimatedStyles = (value?: string) => {
  const { width } = Dimensions.get("window");
  const placeholderAnim = useRef(new Animated.Value(15)).current;
  const lineAnim = useRef(new Animated.Value(width)).current;
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    if (focus || value) {
      Animated.timing(lineAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();

      Animated.timing(placeholderAnim, {
        toValue: 40,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(lineAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start();

      Animated.timing(placeholderAnim, {
        toValue: 15,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [focus, value]);

  return { focus, setFocus, placeholderAnim, lineAnim };
};

// Tipagem das props do InputBase
interface InputBaseProps extends TextInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps["keyboardType"];
  error?: string;
  secureTextEntry?: boolean;
  toggleSecureTextEntry?: () => void;
  inputRef?: React.Ref<TextInput>;
  inputGroupStyle?: StyleProp<ViewStyle>;
}

export const InputBase: React.FC<InputBaseProps> = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  error,
  secureTextEntry,
  toggleSecureTextEntry,
  inputRef,
  inputGroupStyle = {},
  ...inputProps
}) => {
  const { setFocus, placeholderAnim, lineAnim } = useAnimatedStyles(value);

  return (
    <View style={[styles.inputGroup, inputGroupStyle]}>
      <View style={styles.formControl}>
        <View style={styles.field}>
          <View
            style={[
              styles.line,
              { backgroundColor: error ? "#92000A" : "#adadad" },
            ]}
          />
          <Animated.View style={[styles.focusLine, { right: lineAnim }]}>
            <LinearGradient
              colors={["#7B55E0", "#000"]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
          <TextInput
            ref={inputRef}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={styles.textInput}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            value={value}
            secureTextEntry={secureTextEntry}
            {...inputProps}
          />
          {toggleSecureTextEntry && (
            <Pressable style={styles.security} onPress={toggleSecureTextEntry}>
              <FontAwesomeIcon
                icon={secureTextEntry ? faEye : faEyeSlash}
                size={22}
                color="black"
              />
            </Pressable>
          )}
        </View>
        <View pointerEvents="none">
          <Animated.Text
            style={[styles.placeholder, { bottom: placeholderAnim }]}
          >
            {placeholder}
          </Animated.Text>
        </View>
      </View>
    </View>
  );
};

// Reaproveita a tipagem de InputBaseProps
interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  error?: string;
}

export const InputNumber: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  error,
}) => {
  return (
    <InputBase
      value={value}
      onChangeText={(text) => onChangeText?.(text?.replace(/[^0-9]/g, ""))}
      placeholder={placeholder}
      keyboardType="numeric"
      error={error}
    />
  );
};

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  error,
}) => (
  <InputBase
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    error={error}
  />
);

export const InputPassword: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  error,
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <InputBase
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      error={error}
      secureTextEntry={secureTextEntry}
      toggleSecureTextEntry={() => setSecureTextEntry(!secureTextEntry)}
    />
  );
};

interface InputDateProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  error?: string;
  min?: Date; // 🔹 Nova prop: data mínima
  [key: string]: any; // permite props extras
}

export const InputDate: React.FC<InputDateProps> = ({
  value,
  onChange,
  placeholder,
  error,
  min,
  ...props
}) => {
  const selectInputStyle = StyleSheet.create({
    selectItem: {
      padding: 15,
      flex: 1,
    },
    container: {
      flex: 1,
    },
  });

  const [pickerVisible, setPickerVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "year">("calendar");
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());

  const togglePicker = () => {
    setPickerVisible(!pickerVisible);
    if (!pickerVisible) {
      setViewMode("calendar");
    }
  };

  const generateCalendarMatrix = (month: number, year: number) => {
    const firstDay = dayjs().year(year).month(month).date(1);
    const daysInMonth = firstDay.daysInMonth();
    const startDay = firstDay.day();

    const matrix: (Dayjs | null)[][] = [];
    let week: (Dayjs | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      week.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      week.push(dayjs().year(year).month(month).date(d).startOf("day"));
      if (week.length === 7) {
        matrix.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      matrix.push(week);
    }

    return matrix;
  };

  const generateYearRange = (centerYear = selectedYear) => {
    const years: number[] = [];
    const startYear = centerYear - 6;
    const endYear = centerYear + 5;

    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    return years;
  };

  const handleMonthChange = (newMonth: Dayjs) => {
    setCurrentMonth(newMonth);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setCurrentMonth(currentMonth.year(year));
    setViewMode("calendar");
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "calendar" ? "year" : "calendar");
  };

  const calendarMatrix = generateCalendarMatrix(
    currentMonth.month(),
    currentMonth.year()
  );

  const yearRange = generateYearRange();

  return (
    <View style={selectInputStyle.container}>
      <Pressable onPress={togglePicker} style={styles.formControl}>
        <InputBase
          editable={false}
          placeholder={placeholder}
          value={value ? dayjs(value).format("DD/MM/YYYY") : ""}
          error={error}
          {...props}
        />
        <FontAwesomeIcon style={styles.right} icon={faCalendar} size={16} />
      </Pressable>
      <ModalContainer visible={pickerVisible} toggle={togglePicker}>
        <View style={{ padding: 10 }}>
          {/* Header com mês/ano */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{ padding: 20 }}
              onPress={() => {
                if (viewMode === "calendar") {
                  handleMonthChange(currentMonth.subtract(1, "month"));
                } else {
                  setSelectedYear(selectedYear - 12);
                }
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} size={16} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleViewMode}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                {viewMode === "calendar"
                  ? currentMonth.format("MMMM YYYY").charAt(0).toUpperCase() +
                    currentMonth.format("MMMM YYYY").slice(1)
                  : `${selectedYear - 6}-${selectedYear + 5}`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ padding: 20 }}
              onPress={() => {
                if (viewMode === "calendar") {
                  handleMonthChange(currentMonth.add(1, "month"));
                } else {
                  setSelectedYear(selectedYear + 12);
                }
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} size={16} />
            </TouchableOpacity>
          </View>

          {viewMode === "calendar" ? (
            <>
              {/* Cabeçalho dias da semana */}
              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                  <Text
                    style={{
                      width: 40,
                      textAlign: "center",
                      color: "#888",
                      fontSize: 12,
                    }}
                    key={d}
                  >
                    {d}
                  </Text>
                ))}
              </View>

              {/* Grid de dias */}
              {calendarMatrix.map((week, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  {week.map((day, j) => {
                    const isSelected =
                      day && value && dayjs(value).isSame(day, "day");
                    const isToday = day && day.isSame(dayjs(), "day");
                    const isBeforeMin =
                      day && min ? day.isBefore(dayjs(min), "day") : false;

                    return (
                      <TouchableOpacity
                        key={j}
                        style={{
                          width: 40,
                          height: 40,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 20,
                          backgroundColor: isSelected
                            ? primaryColor
                            : isToday
                            ? "#E4E4E4"
                            : "transparent",
                        }}
                        disabled={!day || isBeforeMin}
                        onPress={() => {
                          if (day && !isBeforeMin) {
                            onChange(day.toDate());
                            togglePicker();
                          }
                        }}
                      >
                        <Text
                          style={{
                            color: isBeforeMin
                              ? "#AAA"
                              : isSelected
                              ? "#FFF"
                              : "#000",
                          }}
                        >
                          {day ? day.date() : ""}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </>
          ) : (
            /* Grid de anos */
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {yearRange.map((year, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: "25%",
                    padding: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      year === currentMonth.year()
                        ? primaryColor
                        : "transparent",
                    borderRadius: 8,
                    margin: 5,
                  }}
                  onPress={() => handleYearSelect(year)}
                >
                  <Text
                    style={{
                      color: year === currentMonth.year() ? "#FFF" : "#000",
                      fontWeight:
                        year === currentMonth.year() ? "bold" : "normal",
                    }}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ModalContainer>
    </View>
  );
};

// ------------------- RadialPicker -------------------
interface RadialPickerProps {
  size?: number;
  steps?: number;
  interval?: number;
  onChange?: (value: number) => void;
  value: number;
  showValue?: boolean;
}

const RadialPicker: FC<RadialPickerProps> = ({
  size = 300,
  steps = 60,
  interval = 5,
  onChange,
  value,
  showValue = false,
}) => {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const center = size / 2;
  const radius = center - 20;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (
          evt: GestureResponderEvent,
          _gesture: PanResponderGestureState
        ) => {
          const x = evt.nativeEvent.locationX - center;
          const y = evt.nativeEvent.locationY - center;
          let angle = Math.atan2(y, x) + Math.PI / 2;
          if (angle < 0) angle += 2 * Math.PI;
          const newValue = Math.round((angle / (2 * Math.PI)) * (steps - 1));
          setCurrentValue(newValue);
          onChange?.(newValue);
        },
      }),
    [steps, center, radius, onChange]
  );

  useEffect(() => {
    setCurrentValue(value);
  }, [value, steps]);

  const angle = (currentValue / steps) * 2 * Math.PI - Math.PI / 2;
  const ballX = center + Math.cos(angle) * radius;
  const ballY = center + Math.sin(angle) * radius;

  const radialStyles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      margin: 20,
    },
    valueText: {
      marginTop: 15,
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
    },
  });

  return (
    <View style={radialStyles.container} {...panResponder.panHandlers}>
      <Svg
        width={size}
        height={size}
        viewBox={`-15 -15 ${size + 30} ${size + 30}`} // margem extra
      >
        {/* Circunferência */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e0e0e0"
          strokeWidth={24}
          fill="none"
        />

        {/* Labels ao redor */}
        {Array.from({ length: steps / interval + 1 }, (_, i) => {
          const val = i * interval;
          if (val === steps) return null; // evita sobreposição do 60 com o 0

          const angleLabel = (val / steps) * 2 * Math.PI - Math.PI / 2;
          const labelRadius = radius + 25;
          const x = center + Math.cos(angleLabel) * labelRadius;
          const y = center + Math.sin(angleLabel) * labelRadius + 5;
          const isActive = currentValue === val;

          return (
            <SvgText
              key={i}
              x={x}
              y={y}
              fontSize={isActive ? "16" : "12"}
              fill={isActive ? primaryColor : "#333"}
              fontWeight={isActive ? "bold" : "normal"}
              textAnchor="middle"
            >
              {val}
            </SvgText>
          );
        })}

        {/* Bolinha de seleção */}
        <Circle
          cx={ballX}
          cy={ballY}
          r={12}
          fill={primaryColor}
          stroke="#fff"
        />

        {/* Valor central opcional */}
        {showValue && (
          <SvgText
            x={center}
            y={center + 10}
            fontSize="32"
            fontWeight="bold"
            fill={primaryColor}
            textAnchor="middle"
          >
            {currentValue}
          </SvgText>
        )}
      </Svg>
    </View>
  );
};

// ------------------- InputTime -------------------
interface InputTimeProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const InputTime: FC<InputTimeProps> = ({
  value,
  onChange,
  placeholder,
  error,
  ...props
}) => {
  const { width } = Dimensions.get("window");
  const CLOCK_SIZE = width * 0.8;

  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"hour" | "minute">("hour");
  const [hour, setHour] = useState(new Date().getHours());
  const [minute, setMinute] = useState(new Date().getMinutes());
  const [second] = useState("00");

  const opacity = useRef(new Animated.Value(1)).current;

  const switchMode = (newMode: "hour" | "minute") => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setMode(newMode);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  };

  const togglePicker = () => {
    setVisible(!visible);
    setMode("hour");
  };

  const confirm = () => {
    if (mode === "hour") {
      switchMode("minute");
    } else {
      onChange(
        `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}:${second.toString().padStart(2, "0")}`
      );
      togglePicker();
    }
  };

  const inputTimeStyles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: CLOCK_SIZE,
      backgroundColor: "white",
      borderRadius: 12,
      alignItems: "center",
    },
    timeTextContainer: {
      backgroundColor: "#E4E4E4",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
    },
    selectedTimeTextContainer: {
      backgroundColor: `${primaryColor}30`,
    },
    timeText: {
      fontSize: 32,
    },
    selectedTimeText: {
      color: primaryColor,
    },
    actions: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "flex-end",
    },
    action: {
      color: primaryColor,
      padding: 20,
    },
  });

  return (
    <View>
      <Pressable onPress={togglePicker}>
        <InputBase
          editable={false}
          placeholder={placeholder}
          value={
            value ? format(parse(value, "HH:mm:ss", new Date()), "HH:mm") : ""
          }
          error={error}
          {...props}
        />
      </Pressable>

      <ModalContainer visible={visible} toggle={togglePicker}>
        <View style={inputTimeStyles.modalOverlay}>
          <View style={inputTimeStyles.container}>
            <MutedText style={{ margin: 15 }}>Selecione o horário</MutedText>

            {/* Hora e Minuto */}
            <View style={{ flexDirection: "row", gap: 2 }}>
              <Pressable
                onPress={() => switchMode("hour")}
                style={[
                  inputTimeStyles.timeTextContainer,
                  mode === "hour"
                    ? inputTimeStyles.selectedTimeTextContainer
                    : {},
                ]}
              >
                <Text
                  style={[
                    inputTimeStyles.timeText,
                    mode === "hour" ? inputTimeStyles.selectedTimeText : {},
                  ]}
                >
                  {hour.toString().padStart(2, "0")}
                </Text>
              </Pressable>
              <Text style={inputTimeStyles.timeText}>:</Text>
              <Pressable
                onPress={() => switchMode("minute")}
                style={[
                  inputTimeStyles.timeTextContainer,
                  mode === "minute"
                    ? inputTimeStyles.selectedTimeTextContainer
                    : {},
                ]}
              >
                <Text
                  style={[
                    inputTimeStyles.timeText,
                    mode === "minute" ? inputTimeStyles.selectedTimeText : {},
                  ]}
                >
                  {minute.toString().padStart(2, "0")}
                </Text>
              </Pressable>
            </View>

            {/* RadialPicker animado */}
            <Animated.View style={{ opacity }}>
              {mode === "hour" ? (
                <RadialPicker
                  value={hour}
                  size={CLOCK_SIZE * 0.9}
                  steps={24}
                  interval={3}
                  onChange={setHour}
                />
              ) : (
                <RadialPicker
                  interval={5}
                  value={minute}
                  size={CLOCK_SIZE * 0.9}
                  steps={60}
                  onChange={setMinute}
                />
              )}
            </Animated.View>

            {/* Ações */}
            <View style={inputTimeStyles.actions}>
              <TouchableOpacity onPress={togglePicker}>
                <Text style={inputTimeStyles.action}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirm}>
                <Text style={inputTimeStyles.action}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ModalContainer>
    </View>
  );
};

// Tipos auxiliares
type SelectPickerItem = {
  label: string;
  value: string | number;
};

type SelectPickerProps = {
  selectedValue?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  items: SelectPickerItem[];
};

export const SelectPicker: React.FC<SelectPickerProps> = ({
  selectedValue,
  onChange,
  placeholder,
  error,
  items,
  ...props
}) => {
  const pickerRef = useRef<Picker<string | number>>(null);
  const [selected, setSelected] = useState<SelectPickerItem | undefined>();

  const open = () => {
    pickerRef.current?.focus();
  };

  useEffect(() => {
    const pickerItem = items.find((x) => x.value === selectedValue);
    setSelected(pickerItem);
  }, [selectedValue, items]);

  return (
    <>
      <Pressable style={styles.formControl} onPress={open}>
        <InputBase
          value={selected?.label}
          placeholder={placeholder}
          error={error}
          editable={false}
          {...props}
        />
        <FontAwesomeIcon style={styles.right} icon={faChevronDown} size={16} />
      </Pressable>

      <Picker
        style={{ display: "none" }}
        ref={pickerRef}
        selectedValue={selectedValue}
        onValueChange={onChange}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </>
  );
};

// ---------- SelectInput ----------
type SelectInputItem = {
  id: string | number;
  name: string;
};

type SelectInputProps = {
  selected?: string | number;
  onSelected: (item: SelectInputItem) => void;
  placeholder?: string;
  error?: string;
  items: SelectInputItem[];
};

export const SelectInput: React.FC<SelectInputProps> = ({
  selected,
  onSelected,
  placeholder,
  error,
  items,
  ...props
}) => {
  const selectInputStyle = StyleSheet.create({
    selectItem: {
      padding: 15,
      flex: 1,
    },
    container: {
      flex: 1,
    },
  });

  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    SelectInputItem | undefined
  >();

  const togglePicker = () => {
    setPickerVisible((prev) => !prev);
  };

  const onSelect = (item: SelectInputItem) => {
    onSelected(item);
    togglePicker();
  };

  useEffect(() => {
    const item = items?.find((x) => x.id === selected);
    if (item) {
      setSelectedItem(item);
    }
  }, [selected, items]);

  return (
    <View style={selectInputStyle.container}>
      <Pressable onPress={togglePicker} style={styles.formControl}>
        <InputBase
          editable={false}
          placeholder={placeholder}
          value={selectedItem?.name}
          error={error}
          {...props}
        />
        <FontAwesomeIcon style={styles.right} icon={faChevronDown} size={16} />
      </Pressable>
      <ModalContainer
        overlayStyle={{ bottom: 10 }}
        visible={pickerVisible}
        toggle={togglePicker}
      >
        <CustomScrollView style={{ borderRadius: 20 }}>
          {items?.map((item) => (
            <TouchableOpacity
              onPress={() => onSelect(item)}
              key={item.id}
              style={selectInputStyle.selectItem}
            >
              <Text style={{ fontSize: 20 }}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </CustomScrollView>
      </ModalContainer>
    </View>
  );
};

type ImageFile = {
  size?: number;
  name?: string | null | undefined;
  mimeType?: string;
  base64: string;
};

type ImagePickerProps = {
  onPicker: (file: ImageFile) => void;
  photo?: string;
};

export const ImagePicker: React.FC<ImagePickerProps> = ({
  onPicker,
  photo,
}) => {
  const pickImage = async () => {
    const permissionResult = await SelectImage.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Você recusou o acesso à câmera!");
      return;
    }

    const result = await SelectImage.launchImageLibraryAsync({
      mediaTypes: SelectImage.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const file: ImageFile = {
        size: asset.fileSize,
        name: asset.fileName,
        mimeType: asset.mimeType,
        base64: `data:${asset.mimeType};base64,${asset.base64}`,
      };
      onPicker(file);
    }
  };

  return (
    <Pressable style={styles.preview} onPress={pickImage}>
      {photo ? (
        <>
          <Image style={styles.preview} source={{ uri: photo }} />
          <View
            style={{
              position: "absolute",
              backgroundColor: "#f9f9f9",
              padding: 12,
              borderRadius: 24,
              opacity: 0.8,
            }}
          >
            <FontAwesomeIcon icon={faPen} size={22} />
          </View>
        </>
      ) : (
        <View>
          <FontAwesomeIcon icon={faImages} size={48} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    backgroundColor: "#FFF",
    flexDirection: "column",
    gap: 32,
    width: "100%",
    marginTop: 22,
  },
  formControl: {
    position: "relative",
  },
  field: {
    position: "relative",
    overflow: "hidden",
  },
  placeholder: {
    position: "absolute",
    left: 15,
    color: "#999",
    fontFamily: "PoppinsRegular",
  },
  textInput: {
    padding: 16,
    paddingBottom: 12,
    fontSize: 16,
    width: "100%",
    color: "#000",
    fontFamily: "PoppinsRegular",
  },
  line: {
    position: "absolute",
    width: "100%",
    height: 2,
    bottom: 0,
  },
  focusLine: {
    position: "absolute",
    width: "100%",
    height: 2,
    bottom: 0,
  },
  security: {
    position: "absolute",
    right: 10,
    padding: 10,
    bottom: 5,
  },
  right: {
    position: "absolute",
    right: 20,
    bottom: 15,
    color: "#555",
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000010",
    position: "relative",
  },
});
