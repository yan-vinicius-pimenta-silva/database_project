import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Box, FormHelperText,
  Avatar, Typography
} from "@mui/material";
import { useDrivers } from "../hooks/useDrivers";
import { useState, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IMaskInput } from "react-imask";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonIcon from '@mui/icons-material/Person';

// Mask input components
interface MaskInputProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  mask: string;
}

const MaskInput = forwardRef<HTMLInputElement, MaskInputProps>(
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
  }
);

// helper: strip non-digits
const onlyDigits = (val: string) => val.replace(/\D/g, "");

// validation schema
const driverSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "Only letters and spaces allowed"),
  cpf: z.string().refine(val => onlyDigits(val).length === 11, {
    message: "CPF must have 11 digits"
  }),
  phone: z.string().refine(val => {
    const digits = onlyDigits(val);
    return digits.length >= 10 && digits.length <= 11;
  }, { message: "Phone must have 10 or 11 digits" }),
  cnhNumber: z.string().refine(val => onlyDigits(val).length === 11, {
    message: "CNH must have 11 digits"
  }),
  cnhCategory: z.array(z.string()).min(1, "Select at least one category"),
  photo: z.any().optional(),
  cnhPdf: z.any().optional()
});

type DriverForm = z.infer<typeof driverSchema>;

const CNH_CATEGORIES = ["ACC", "A", "A1", "B", "B1", "C", "C1", "D", "D1", "BE", "CE", "C1E", "DE", "D1E"];

export default function Drivers() {
  const { list, create, update, remove } = useDrivers();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cnhPdfName, setCnhPdfName] = useState<string | null>(null);

  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<DriverForm>({
    resolver: zodResolver(driverSchema)
  });

  if (list.isLoading) return <p>Loading...</p>;
  if (list.error) return <p>Error loading drivers</p>;

  const onSubmit = (data: DriverForm) => {
    const clean = {
      name: data.name,
      cpf: onlyDigits(data.cpf),
      phone: onlyDigits(data.phone),
      cnhNumber: onlyDigits(data.cnhNumber),
      cnhCategory: data.cnhCategory.join(","),
      status: "Active",
      photo: data.photo?.[0] || null,
      cnhPdf: data.cnhPdf?.[0] || null
    };

    if (editingId) {
      update.mutate({ ...clean, id: editingId });
    } else {
      create.mutate(clean);
    }
    setOpen(false);
    setEditingId(null);
    setPhotoPreview(null);
    setCnhPdfName(null);
    reset();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue('photo', e.target.files);
    }
  };

  const handleCnhPdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCnhPdfName(file.name);
      setValue('cnhPdf', e.target.files);
    }
  };

  return (
    <div>
      <h1>Drivers</h1>
      <Button
        variant="contained"
        onClick={() => {
          setEditingId(null);
          setPhotoPreview(null);
          setCnhPdfName(null);
          reset({ name: "", cpf: "", phone: "", cnhNumber: "", cnhCategory: [] });
          setOpen(true);
        }}
      >
        Add Driver
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>CNH</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.data?.map((d: any) => (
              <TableRow key={d.id}>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.cpf}</TableCell>
                <TableCell>{d.phone}</TableCell>
                <TableCell>{d.cnhNumber}</TableCell>
                <TableCell>{d.cnhCategory}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => {
                      reset({ 
                        name: d.name, 
                        cpf: d.cpf, 
                        phone: d.phone,
                        cnhNumber: d.cnhNumber,
                        cnhCategory: d.cnhCategory ? d.cnhCategory.split(",") : []
                      });
                      setEditingId(d.id);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => remove.mutate(d.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit Driver" : "New Driver"}</DialogTitle>
        <DialogContent>
          <form id="driver-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Photo Upload */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, mt: 2 }}>
              <Avatar
                src={photoPreview || undefined}
                sx={{ width: 120, height: 120, mb: 2 }}
              >
                {!photoPreview && <PersonIcon sx={{ fontSize: 60 }} />}
              </Avatar>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                size="small"
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                JPG, PNG or GIF (max 5MB)
              </Typography>
            </Box>

            <TextField
              margin="dense"
              label="Name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <Controller
              name="cpf"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <TextField
                  margin="dense"
                  label="CPF"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  name={name}
                  error={!!errors.cpf}
                  helperText={errors.cpf?.message}
                  slotProps={{
                    input: {
                      inputComponent: MaskInput as any,
                      inputProps: {
                        mask: "000.000.000-00",
                      },
                    },
                  }}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <TextField
                  margin="dense"
                  label="Phone"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  name={name}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  slotProps={{
                    input: {
                      inputComponent: MaskInput as any,
                      inputProps: {
                        mask: "+00 (00) 00000-0000",
                      },
                    },
                  }}
                />
              )}
            />

            <Controller
              name="cnhNumber"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <TextField
                  margin="dense"
                  label="CNH Number"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  name={name}
                  error={!!errors.cnhNumber}
                  helperText={errors.cnhNumber?.message}
                  slotProps={{
                    input: {
                      inputComponent: MaskInput as any,
                      inputProps: {
                        mask: "00000000000",
                      },
                    },
                  }}
                />
              )}
            />

            <Controller
              name="cnhCategory"
              control={control}
              defaultValue={[]}
              render={({ field: { onChange, value } }) => (
                <FormControl fullWidth margin="dense" error={!!errors.cnhCategory}>
                  <InputLabel>CNH Categories</InputLabel>
                  <Select
                    multiple
                    value={value}
                    onChange={onChange}
                    input={<OutlinedInput label="CNH Categories" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((val) => (
                          <Chip key={val} label={val} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {CNH_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.cnhCategory && (
                    <FormHelperText>{errors.cnhCategory.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* CNH PDF Upload */}
            <Box sx={{ mt: 2, mb: 1 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                {cnhPdfName || "Upload CNH PDF"}
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={handleCnhPdfChange}
                />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                PDF format only (max 10MB)
              </Typography>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="driver-form">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}