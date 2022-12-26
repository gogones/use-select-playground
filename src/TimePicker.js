import React, { useRef, useMemo, useState, useCallback } from "react";
import useSelect from "use-select";
import styled from "styled-components";
import matchSorter from "match-sorter";
import { FixedSizeList } from "react-window";
import {
  startOfToday,
  endOfToday,
  differenceInMinutes,
  add,
  format,
  isValid
} from "date-fns";

const OptionsWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
`;

const Options = styled(FixedSizeList)`
  border: 1px solid black;
`;

const Option = styled.div`
  background: ${(props) =>
    props.highlighted ? "lightblue" : props.selected ? "lightgray" : "white"};
  display: flex;
  alignitems: center;
  padding: 0.5rem;
`;

const useTimeOptions = (
  minTime = startOfToday(),
  maxTime = endOfToday(),
  timeIntervals = 15
) => {
  return useMemo(() => {
    const diffInMinutes = differenceInMinutes(maxTime, minTime, {
      roundingMethod: "ceil"
    });

    return [...Array(Math.ceil(diffInMinutes / timeIntervals))].map(
      (_, index) => ({
        value: add(minTime, { minutes: index * timeIntervals }),

        label: format(
          add(minTime, { minutes: index * timeIntervals }),
          "hh:mmaaa"
        )
      })
    );
  }, [minTime, maxTime, timeIntervals]);
};

export default function TimePicker({
  selectedTime,
  onChange: onChangeProps,
  pageSize = 10,
  itemHeight = 40
}) {
  const reactWindowInstanceRef = useRef();
  const optionsRef = useRef();

  const scrollToIndex = (index) => {
    if (!reactWindowInstanceRef.current) {
      return;
    }
    reactWindowInstanceRef.current.scrollToItem(index);
  };

  const shiftAmount = pageSize;

  const options = useTimeOptions();
  // const [value, setValue] = useState();

  const value = useMemo(() => {
    if(isValid(selectedTime)) {
      return {
        value: selectedTime,
        label: format(selectedTime, 'hh:mmaaa')
      }
    }
  }, [selectedTime])

  const onChange = useCallback((newValue) => {
    onChangeProps(newValue.value);
  }, [onChangeProps])

  const {
    visibleOptions,
    selectedOption,
    highlightedOption,
    getInputProps,
    getOptionProps,
    isOpen
  } = useSelect({
    options,
    value,
    onChange,
    scrollToIndex,
    optionsRef,
    shiftAmount,
    filterFn: (options, value) =>
      matchSorter(options, value, { keys: ["label"] })
  });

  const height =
    Math.max(Math.min(pageSize, visibleOptions.length), 1) * itemHeight;

  return (
    <div
      style={{
        display: "inline-block",
        position: "relative"
      }}
    >
      <input {...getInputProps()} placeholder="Select one..." />
      <OptionsWrapper ref={optionsRef}>
        {isOpen ? (
          <Options
            ref={reactWindowInstanceRef}
            height={height}
            itemCount={visibleOptions.length || 1}
            itemSize={itemHeight}
            width={400}
          >
            {React.forwardRef(({ index, style, ...rest }, ref) => {
              const option = visibleOptions[index];
              if (!visibleOptions.length) {
                return (
                  <Option ref={ref} style={style}>
                    No options were found...
                  </Option>
                );
              }
              return (
                <Option
                  {...getOptionProps({
                    index,
                    option,
                    ref,
                    style,
                    highlighted: option === highlightedOption,
                    selected: option === selectedOption
                  })}
                >
                  {option.label}
                </Option>
              );
            })}
          </Options>
        ) : null}
      </OptionsWrapper>
    </div>
  );
}
