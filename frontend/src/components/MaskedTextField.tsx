import { type TextFieldProps, TextField } from '@mui/material';
import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  mask: string;
}

const MaskInput = forwardRef<HTMLInputElement, CustomProps>(
  function MaskInput(props, ref) {
    const { onChange, mask, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask={mask}
        inputRef={ref}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

interface MaskedTextFieldProps extends Omit<TextFieldProps, 'onChange'> {
  mask: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
}

export default function MaskedTextField({ mask, value, onChange, name = 'masked-input', ...props }: MaskedTextFieldProps) {
  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      name={name}
      slotProps={{
        input: {
          inputComponent: MaskInput as any,
          inputProps: {
            mask: mask,
          },
        },
      }}
    />
  );
} 