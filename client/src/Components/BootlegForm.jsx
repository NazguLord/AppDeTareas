import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  DialogActions,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import api from '../api';
import { useAlert } from '../context/alertContext';

const initialValues = {
  nombreBanda: '',
  lugar: '',
  categoria: '',
  formato: '',
  tipo: '',
  genero_id: '',
  fecha: '',
  negociable: '',
  cantidadDiscos: '',
  version: '',
  peso: '',
  almacenamiento: '',
  comentario: '',
};

const checkoutSchema = yup.object().shape({
  nombreBanda: yup.string().trim().required('Ingresa la banda.'),
  lugar: yup.string().trim().required('Ingresa el lugar.'),
  categoria: yup.string().oneOf(['Audio', 'Video']).required('Selecciona una categoria.'),
  fecha: yup.string().required('Selecciona la fecha.'),
  negociable: yup.string().oneOf(['Yes', 'No'], 'Selecciona una opcion.').required('Selecciona una opcion.'),
  cantidadDiscos: yup
    .number()
    .typeError('Ingresa un numero valido.')
    .integer('Solo se permiten enteros.')
    .positive('Debe ser mayor que cero.')
    .required('Ingresa la cantidad de discos.'),
  tipo: yup.string().trim().required('Selecciona una fuente.'),
  formato: yup.string().trim().required('Selecciona un formato.'),
  peso: yup
    .number()
    .typeError('Ingresa un peso valido.')
    .required('Ingresa el peso.')
    .test('is-decimal', 'Usa hasta 2 decimales.', (value) => String(value ?? '').match(/^[0-9]+(\.[0-9]{1,2})?$/)),
  almacenamiento: yup.string().trim().required('Ingresa el almacenamiento.'),
  comentario: yup.string().trim().required('Agrega un comentario breve.'),
});

const AUDIO_FORMATS = [
  { value: 'FLAC', label: 'FLAC' },
  { value: 'WAV', label: 'WAV' },
  { value: 'APE', label: 'APE' },
  { value: 'SHN', label: 'SHN' },
  { value: 'CD', label: 'CD' },
  { value: 'CD-R', label: 'CD-R' },
  { value: 'DVD-A', label: 'DVD-A' },
];

const VIDEO_FORMATS = [
  { value: 'DVD', label: 'DVD' },
  { value: 'BLU-RAY', label: 'Blu-Ray' },
  { value: 'TS', label: 'TS' },
  { value: 'MKV', label: 'MKV' },
  { value: 'MP4', label: 'MP4' },
  { value: 'DL', label: 'DL' },
];

const AUDIO_SOURCES = [
  { value: 'Audience', label: 'Audience' },
  { value: 'Soundboard', label: 'Soundboard' },
  { value: 'FMbroadcast', label: 'FM Broadcast' },
  { value: 'LiveStream', label: 'LiveStream' },
];

const VIDEO_SOURCES = [
  { value: 'Audience', label: 'Audience' },
  { value: 'Pro-shot', label: 'Pro-shot' },
  { value: 'Livestream', label: 'Livestream' },
];

const AUDIO_ONLY_FORMATS = ['FLAC', 'WAV', 'APE', 'SHN', 'CD', 'CD-R', 'DVD-A'];

const getErrorMessage = (error) =>
  error?.response?.data?.message || 'No se pudo guardar el bootleg. Intenta de nuevo.';

const BootlegForm = ({ onSuccess, onCancel, submitLabel = 'Guardar bootleg', isDialog = false }) => {
  const { showAlert } = useAlert();
  const [genreOptions, setGenreOptions] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/catalogos/audio-generos');
        setGenreOptions(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.log(error);
        showAlert('No se pudo cargar el catalogo de generos.', 'warning');
      }
    };

    fetchGenres();
  }, [showAlert]);

  const fieldLayout = useMemo(
    () => ({
      '& > *': {
        gridColumn: 'span 12',
      },
      '@media (min-width: 900px)': {
        '& .span-12': { gridColumn: 'span 12' },
        '& .span-8': { gridColumn: 'span 8' },
        '& .span-6': { gridColumn: 'span 6' },
        '& .span-4': { gridColumn: 'span 4' },
        '& .span-3': { gridColumn: 'span 3' },
      },
    }),
    []
  );

  const handleFormSubmit = async (values, helpers) => {
    helpers.setStatus(null);

    try {
      await api.post('/form', values);
      helpers.resetForm();
      showAlert('Bootleg agregado correctamente.', 'success');
      onSuccess?.();
    } catch (error) {
      const message = getErrorMessage(error);
      helpers.setStatus(message);
      showAlert(message, 'error');
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={checkoutSchema} onSubmit={handleFormSubmit}>
      {({ values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, setFieldTouched, status }) => {
        const formatOptions = values.categoria === 'Video' ? VIDEO_FORMATS : AUDIO_FORMATS;
        const isVideoFormat = values.categoria === 'Video' && !AUDIO_ONLY_FORMATS.includes(values.formato);
        const sourceOptions = isVideoFormat ? VIDEO_SOURCES : AUDIO_SOURCES;

        return (
          <form onSubmit={handleSubmit} className="bootleg-form">
            <div className="bootleg-form-intro">
              <Typography variant="overline" className="bootleg-form-kicker">
                Nuevo registro
              </Typography>
              <Typography variant="h4" className="bootleg-form-title">
                Ingresa un bootleg
              </Typography>
              <Typography variant="body1" className="bootleg-form-copy">
                Registra tus bootlegs aqui
              </Typography>
            </div>

            <Box className="bootleg-form-grid" display="grid" gridTemplateColumns="repeat(12, minmax(0, 1fr))" gap="16px" sx={fieldLayout}>
              <TextField
                className="span-6"
                fullWidth
                variant="outlined"
                label="Banda"
                name="nombreBanda"
                value={values.nombreBanda}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.nombreBanda && !!errors.nombreBanda}
                helperText={touched.nombreBanda && errors.nombreBanda}
              />

              <TextField
                className="span-6"
                fullWidth
                select
                variant="outlined"
                label="Categoria"
                name="categoria"
                value={values.categoria}
                onBlur={handleBlur}
                onChange={(event) => {
                  handleChange(event);
                  setFieldValue('formato', '');
                  setFieldValue('tipo', '');
                }}
                error={!!touched.categoria && !!errors.categoria}
                helperText={touched.categoria && errors.categoria}
              >
                <MenuItem value="Audio">Audio</MenuItem>
                <MenuItem value="Video">Video</MenuItem>
              </TextField>

              <TextField
                className="span-6"
                fullWidth
                variant="outlined"
                label="Lugar"
                name="lugar"
                value={values.lugar}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.lugar && !!errors.lugar}
                helperText={touched.lugar && errors.lugar}
              />

              <TextField
                className="span-3"
                fullWidth
                variant="outlined"
                type="date"
                label="Fecha"
                name="fecha"
                value={values.fecha}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.fecha && !!errors.fecha}
                helperText={touched.fecha && errors.fecha}
                InputLabelProps={{ shrink: true }}
              />

              <FormControl className="span-3 bootleg-radio-group" error={!!touched.negociable && !!errors.negociable}>
                <FormLabel>Tradeable</FormLabel>
                <RadioGroup
                  row
                  name="negociable"
                  value={values.negociable}
                  onChange={handleChange}
                  onBlur={() => setFieldTouched('negociable', true, true)}
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Si" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
                <FormHelperText>{touched.negociable && errors.negociable}</FormHelperText>
              </FormControl>

              <TextField
                className="span-4"
                fullWidth
                select
                variant="outlined"
                label={values.categoria === 'Video' ? 'Formato de video' : 'Formato de audio'}
                name="formato"
                value={values.formato}
                onBlur={handleBlur}
                onChange={(event) => {
                  handleChange(event);
                  setFieldValue('tipo', '');
                }}
                error={!!touched.formato && !!errors.formato}
                helperText={touched.formato && errors.formato}
              >
                {formatOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                className="span-4"
                fullWidth
                select
                variant="outlined"
                label={isVideoFormat ? 'Fuente de video' : 'Fuente de audio'}
                name="tipo"
                value={values.tipo}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.tipo && !!errors.tipo}
                helperText={touched.tipo && errors.tipo}
              >
                {sourceOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                className="span-4"
                fullWidth
                select
                variant="outlined"
                label="Genero"
                name="genero_id"
                value={values.genero_id}
                onBlur={handleBlur}
                onChange={handleChange}
              >
                <MenuItem value="">Sin genero</MenuItem>
                {genreOptions.map((option) => (
                  <MenuItem key={option.id || option.codigo} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                className="span-4"
                fullWidth
                variant="outlined"
                label="Version"
                name="version"
                value={values.version}
                onBlur={handleBlur}
                onChange={handleChange}
              />

              <TextField
                className="span-3"
                fullWidth
                variant="outlined"
                type="number"
                label="Discos"
                name="cantidadDiscos"
                value={values.cantidadDiscos}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.cantidadDiscos && !!errors.cantidadDiscos}
                helperText={touched.cantidadDiscos && errors.cantidadDiscos}
              />

              <TextField
                className="span-3"
                fullWidth
                variant="outlined"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                label="Peso"
                name="peso"
                value={values.peso}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.peso && !!errors.peso}
                helperText={touched.peso && errors.peso}
              />

              <TextField
                className="span-6"
                fullWidth
                variant="outlined"
                label="Almacenamiento"
                name="almacenamiento"
                value={values.almacenamiento}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.almacenamiento && !!errors.almacenamiento}
                helperText={touched.almacenamiento && errors.almacenamiento}
              />

              <TextField
                className="span-12"
                fullWidth
                variant="outlined"
                label="Comentario"
                name="comentario"
                value={values.comentario}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.comentario && !!errors.comentario}
                helperText={touched.comentario && errors.comentario}
                multiline
                minRows={3}
              />
            </Box>

            {status ? <div className="bootleg-form-status bootleg-form-status-error">{status}</div> : null}

            <DialogActions className={`bootleg-form-actions ${isDialog ? 'is-dialog' : 'is-page'}`}>
              {onCancel ? (
                <Button variant="text" onClick={onCancel} disabled={isSubmitting}>
                  Cancelar
                </Button>
              ) : null}
              <Button type="submit" variant="contained" className="primary-cta" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : submitLabel}
              </Button>
            </DialogActions>
          </form>
        );
      }}
    </Formik>
  );
};

export default BootlegForm;


