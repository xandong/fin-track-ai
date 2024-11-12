import React, { forwardRef } from "react"
import { NumericFormat, NumericFormatProps } from "react-number-format"

import { Input, InputProps } from "../_ui/input"

export const MoneyInput = forwardRef(
  (
    props: NumericFormatProps<InputProps>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <NumericFormat
        {...props}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        allowNegative={false}
        customInput={Input}
        getInputRef={ref}
        fixedDecimalScale
        decimalScale={2}
      />
    )
  }
)

MoneyInput.displayName = "MoneyInput"
