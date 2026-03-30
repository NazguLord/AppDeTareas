import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  MenuItem,
  Modal,
  Pagination,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import React, { useEffect, useMemo, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import PreviewFile from '../Components/PreviewFile';
import api from '../api';
import './Medicamentos.scss';

const presentationUnits = ['Tabletas', 'Capsulas', 'Sobres', 'Frascos', 'Ampollas', 'Gotas', 'Aplicaciones', 'Unidades'];
const dosageUnits = ['Microgramos', 'Miligramos', 'Gramos', 'Kilogramos', 'Mililitros', 'Litros'];

const valoresIniciales = {
  nombreMedicamento: '',
  descripcion: '',
  cantidadPresentacion: '',
  unidadPresentacion: '',
  dosisCantidad: '',
  dosisUnidad: '',
  imagen: null,
};

const checkoutSchema = yup.object().shape({
  nombreMedicamento: yup.string().required('required'),
  descripcion: yup.string().required('required'),
  cantidadPresentacion: yup
    .number()
    .typeError('required')
    .required('required')
    .test('is-decimal', 'no valid', (value) => (value + '').match(/^[0-9]+(\.[0-9]{1,2}$)?$/)),
  unidadPresentacion: yup.string().required('required'),
  dosisCantidad: yup
    .number()
    .typeError('required')
    .required('required')
    .test('is-decimal', 'no valid', (value) => (value + '').match(/^[0-9]+(\.[0-9]{1,2}$)?$/)),
  dosisUnidad: yup.string().required('required'),
  imagen: yup
    .mixed()
    .test('required', 'Please upload a Profile Photo', (value) => value != null)
    .test('type', 'We only support jpeg and jpg format', (value) => value && (value.type === 'image/jpg' || value.type === 'image/jpeg' || value.type === 'image/png' || value.type === 'image/webp')),
});

const getMedicineImage = (fileName) => {
  try {
    return require(`../img/${fileName}`);
  } catch (error) {
    return null;
  }
};

const hasValue = (value) => value !== null && value !== undefined && `${value}`.trim() !== '';

const formatValueWithUnit = (value, unit, emptyLabel = 'Sin dato') => {
  if (!hasValue(value) && !hasValue(unit)) return emptyLabel;
  if (!hasValue(unit)) return `${value}`;
  if (!hasValue(value)) return `${unit}`;
  return `${value} ${unit}`;
};

const getPresentationCount = (medicamento) => medicamento?.cantidadPresentacion ?? null;
const getPresentationUnit = (medicamento) => medicamento?.unidadPresentacion || '';
const getDosageCount = (medicamento) => medicamento?.dosisCantidad ?? medicamento?.cantidad ?? null;
const getDosageUnit = (medicamento) => medicamento?.dosisUnidad || medicamento?.unidadMedida || '';

const formatPresentation = (medicamento) =>
  formatValueWithUnit(getPresentationCount(medicamento), getPresentationUnit(medicamento), 'Sin presentacion');

const formatDosage = (medicamento) =>
  formatValueWithUnit(getDosageCount(medicamento), getDosageUnit(medicamento), 'Sin dosis');

const formatMedicineSummary = (medicamento) => {
  const parts = [];
  if (hasValue(getPresentationCount(medicamento)) || hasValue(getPresentationUnit(medicamento))) {
    parts.push(formatPresentation(medicamento));
  }
  if (hasValue(getDosageCount(medicamento)) || hasValue(getDosageUnit(medicamento))) {
    parts.push(formatDosage(medicamento));
  }
  return parts.length ? parts.join(' · ') : 'Sin datos';
};

const getMedicineId = (medicamento) =>
  medicamento?.id ??
  medicamento?.idmedicamentos ??
  medicamento?.idMedicamentos ??
  medicamento?.id_medicamentos ??
  medicamento?.idmedicamento ??
  medicamento?.idMedicamento ??
  medicamento?.id_medicamento ??
  null;

const createMedicineForm = (medicamento) => ({
  nombreMedicamento: medicamento?.nombreMedicamento || '',
  descripcion: medicamento?.descripcion || '',
  cantidadPresentacion: medicamento?.cantidadPresentacion ?? '',
  unidadPresentacion: medicamento?.unidadPresentacion || '',
  dosisCantidad: medicamento?.dosisCantidad ?? medicamento?.cantidad ?? '',
  dosisUnidad: medicamento?.dosisUnidad || medicamento?.unidadMedida || '',
  imagen: null,
  imagenActual: medicamento?.imagen || '',
});

const Medicamentos = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [open, setOpen] = useState(false);
  const [medicamentos, setMedicamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cardsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [medicineForm, setMedicineForm] = useState(createMedicineForm(null));
  const [isSaving, setIsSaving] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const fetchAllMedicamentos = async () => {
    try {
      const res = await api.get('/medicamentos');
      setMedicamentos(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllMedicamentos();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const filteredMedicamentos = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return medicamentos;

    return medicamentos.filter((medicamento) =>
      [
        medicamento.nombreMedicamento,
        medicamento.descripcion,
        medicamento.unidadPresentacion,
        medicamento.cantidadPresentacion,
        medicamento.dosisCantidad,
        medicamento.dosisUnidad,
        medicamento.cantidad,
        medicamento.unidadMedida,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [medicamentos, searchTerm]);

  const paginatedMedicamentos = useMemo(
    () => filteredMedicamentos.slice((page - 1) * cardsPerPage, page * cardsPerPage),
    [filteredMedicamentos, page, cardsPerPage]
  );

  const stats = useMemo(() => {
    const presentationSet = new Set(medicamentos.map((item) => item.unidadPresentacion).filter(Boolean));
    const dosageSet = new Set(medicamentos.map((item) => item.dosisUnidad || item.unidadMedida).filter(Boolean));
    const withDescription = medicamentos.filter((item) => item.descripcion && item.descripcion.trim()).length;

    return [
      {
        icon: <MedicalServicesOutlinedIcon fontSize="small" />,
        label: 'Medicamentos',
        value: `${medicamentos.length}`,
        copy: 'Registros cargados dentro de esta biblioteca personal.',
      },
      {
        icon: <Inventory2OutlinedIcon fontSize="small" />,
        label: 'Presentaciones',
        value: `${presentationSet.size || dosageSet.size}`,
        copy: 'Formatos de empaque y dosis detectados en el inventario.',
      },
      {
        icon: <DescriptionOutlinedIcon fontSize="small" />,
        label: 'Con descripcion',
        value: `${withDescription}`,
        copy: 'Fichas listas para revisar que hace cada medicamento.',
      },
    ];
  }, [medicamentos]);

  const handleFormSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append('nombreMedicamento', values.nombreMedicamento);
    formData.append('descripcion', values.descripcion);
    formData.append('cantidadPresentacion', values.cantidadPresentacion);
    formData.append('unidadPresentacion', values.unidadPresentacion);
    formData.append('dosisCantidad', values.dosisCantidad);
    formData.append('dosisUnidad', values.dosisUnidad);
    formData.append('cantidad', values.dosisCantidad);
    formData.append('unidadMedida', values.dosisUnidad);
    formData.append('imagen', values.imagen);

    try {
      await api.post('/medicamentos', formData);
      handleClose();
      resetForm();
      await fetchAllMedicamentos();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Medicamento agregado.',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const openMedicineDetail = (medicamento) => {
    setSelectedMedicamento(medicamento);
    setMedicineForm(createMedicineForm(medicamento));
    setIsEditing(false);
    setIsSaving(false);
  };

  const closeMedicineDetail = () => {
    setSelectedMedicamento(null);
    setMedicineForm(createMedicineForm(null));
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleMedicineChange = (field) => (event) => {
    setMedicineForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleMedicineImage = (event) => {
    const file = event.currentTarget.files?.[0] || null;
    setMedicineForm((current) => ({
      ...current,
      imagen: file,
    }));
  };

  const handleSaveMedicine = async () => {
    const medicineId = getMedicineId(selectedMedicamento);
    if (!medicineId) return;

    const formData = new FormData();
    formData.append('nombreMedicamento', medicineForm.nombreMedicamento || '');
    formData.append('descripcion', medicineForm.descripcion || '');
    formData.append('cantidadPresentacion', medicineForm.cantidadPresentacion ?? '');
    formData.append('unidadPresentacion', medicineForm.unidadPresentacion || '');
    formData.append('dosisCantidad', medicineForm.dosisCantidad ?? '');
    formData.append('dosisUnidad', medicineForm.dosisUnidad || '');
    formData.append('cantidad', medicineForm.dosisCantidad ?? '');
    formData.append('unidadMedida', medicineForm.dosisUnidad || '');
    formData.append('imagenActual', medicineForm.imagenActual || '');
    if (medicineForm.imagen) {
      formData.append('imagen', medicineForm.imagen);
    }

    try {
      setIsSaving(true);
      const res = await api.put(`/medicamentos/${medicineId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updated = {
        ...selectedMedicamento,
        nombreMedicamento: medicineForm.nombreMedicamento,
        descripcion: medicineForm.descripcion,
        cantidadPresentacion: medicineForm.cantidadPresentacion,
        unidadPresentacion: medicineForm.unidadPresentacion,
        dosisCantidad: medicineForm.dosisCantidad,
        dosisUnidad: medicineForm.dosisUnidad,
        cantidad: medicineForm.dosisCantidad,
        unidadMedida: medicineForm.dosisUnidad,
        imagen: res?.data?.imagen || medicineForm.imagenActual,
      };

      setMedicamentos((current) => current.map((item) => (getMedicineId(item) === medicineId ? updated : item)));
      closeMedicineDetail();

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Cambios guardados',
        text: 'La ficha del medicamento se actualizo correctamente.',
        toast: true,
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: true,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'No se pudo actualizar',
        text: 'Revisa los datos e intenta guardar nuevamente.',
        toast: true,
        showConfirmButton: false,
        timer: 2600,
        timerProgressBar: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(filteredMedicamentos.length / cardsPerPage));
  const detailImage = getMedicineImage(selectedMedicamento?.imagen);

  return (
    <section className="medicine-page task-page">
      <div className="task-hero medicine-hero">
        <div className="task-hero-copy">
          <span className="eyebrow">Medicina</span>
          <h1>Botiquin visual</h1>
          <p>
            Una vista mas clara para ubicar piezas, dosis y descripcion de cada medicamento sin perder tiempo leyendo
            tarjetas viejas o demasiado comprimidas.
          </p>
        </div>
        <div className="task-hero-actions">
          <Button variant="contained" className="primary-cta" onClick={handleOpen}>
            Agregar medicamento
          </Button>
          <Chip label={`${medicamentos.length} cargados`} className="task-chip" />
        </div>
      </div>

      <div className="task-metrics medicine-stats">
        {stats.map((stat) => (
          <div className="metric-card" key={stat.label}>
            <span className="metric-icon">{stat.icon}</span>
            <span className="metric-label">{stat.label}</span>
            <strong className="metric-value">{stat.value}</strong>
            <p className="metric-copy">{stat.copy}</p>
          </div>
        ))}
      </div>

      <div className="medicine-shell">
        <div className="task-section-head medicine-shell-head">
          <div>
            <span className="section-kicker">Directorio</span>
            <h2>Medicamentos disponibles</h2>
          </div>
          <div className="medicine-toolbar">
            <div className="medicine-search">
              <SearchOutlinedIcon fontSize="small" />
              <input
                type="text"
                placeholder="Buscar por nombre, descripcion, piezas o dosis..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <p>Ahora la ficha separa la cantidad de piezas del medicamento y la dosis real de su contenido.</p>
          </div>
        </div>

        <div className="medicine-grid">
          {paginatedMedicamentos.map((medicamento, index) => {
            const imageSrc = getMedicineImage(medicamento.imagen);

            return (
              <Card className="medicine-card" key={`${getMedicineId(medicamento) || medicamento.nombreMedicamento}-${index}`} elevation={0}>
                <div className="medicine-media-wrap">
                  {imageSrc ? (
                    <img className="medicine-media" src={imageSrc} alt={medicamento.nombreMedicamento} />
                  ) : (
                    <div className="medicine-media medicine-media-fallback">Sin imagen</div>
                  )}
                </div>

                <div className="medicine-card-body">
                  <div className="medicine-card-head">
                    <h3>{medicamento.nombreMedicamento}</h3>
                    <span className="medicine-quantity-pill">{formatMedicineSummary(medicamento)}</span>
                  </div>

                  <p className="medicine-description-preview">{medicamento.descripcion || 'Sin descripcion registrada.'}</p>

                  <div className="medicine-meta medicine-meta-expanded">
                    <div>
                      <small>Presentacion</small>
                      <span>{getPresentationUnit(medicamento) || 'Sin unidad'}</span>
                    </div>
                    <div>
                      <small>Piezas</small>
                      <span>{getPresentationCount(medicamento) || '0'}</span>
                    </div>
                    <div>
                      <small>Dosis</small>
                      <span>{getDosageCount(medicamento) || '0'}</span>
                    </div>
                    <div>
                      <small>Unidad dosis</small>
                      <span>{getDosageUnit(medicamento) || 'Sin unidad'}</span>
                    </div>
                  </div>
                </div>

                <div className="medicine-card-actions">
                  <Button variant="outlined" startIcon={<VisibilityOutlinedIcon fontSize="small" />} onClick={() => openMedicineDetail(medicamento)}>
                    Ver detalle
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Box py={3} display="flex" justifyContent="center">
        <Pagination count={pageCount} page={page} onChange={(event, value) => setPage(value)} variant="outlined" shape="rounded" />
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box className={`medicine-modal ${isDark ? 'is-dark' : 'is-light'}`}>
          <div className="medicine-modal-head">
            <div>
              <span className="medicine-modal-kicker">Nuevo registro</span>
              <Typography component="h2" className="medicine-modal-title">
                Agregar medicamento
              </Typography>
              <p>Captura nombre, descripcion, piezas por empaque y dosis para que la ficha quede completa.</p>
            </div>
          </div>

          <Formik onSubmit={handleFormSubmit} initialValues={valoresIniciales} validationSchema={checkoutSchema}>
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit} className="medicine-form">
                <div className="medicine-form-grid medicine-form-grid-expanded">
                  <TextField fullWidth label="Nombre del medicamento" name="nombreMedicamento" value={values.nombreMedicamento} onBlur={handleBlur} onChange={handleChange} error={!!touched.nombreMedicamento && !!errors.nombreMedicamento} helperText={touched.nombreMedicamento && errors.nombreMedicamento} />
                  <TextField fullWidth label="Cantidad de piezas" name="cantidadPresentacion" value={values.cantidadPresentacion} onBlur={handleBlur} onChange={handleChange} error={!!touched.cantidadPresentacion && !!errors.cantidadPresentacion} helperText={touched.cantidadPresentacion && errors.cantidadPresentacion} />
                  <TextField fullWidth select label="Tipo de presentacion" value={values.unidadPresentacion || ''} name="unidadPresentacion" onBlur={handleBlur} onChange={handleChange} error={!!touched.unidadPresentacion && !!errors.unidadPresentacion} helperText={touched.unidadPresentacion && errors.unidadPresentacion}>
                    {presentationUnits.map((unidad) => (
                      <MenuItem key={unidad} value={unidad}>{unidad}</MenuItem>
                    ))}
                  </TextField>
                  <TextField fullWidth label="Dosis o medida" name="dosisCantidad" value={values.dosisCantidad} onBlur={handleBlur} onChange={handleChange} error={!!touched.dosisCantidad && !!errors.dosisCantidad} helperText={touched.dosisCantidad && errors.dosisCantidad} />
                  <TextField fullWidth select label="Unidad de dosis" value={values.dosisUnidad || ''} name="dosisUnidad" onBlur={handleBlur} onChange={handleChange} error={!!touched.dosisUnidad && !!errors.dosisUnidad} helperText={touched.dosisUnidad && errors.dosisUnidad}>
                    {dosageUnits.map((unidad) => (
                      <MenuItem key={unidad} value={unidad}>{unidad}</MenuItem>
                    ))}
                  </TextField>
                  <TextField fullWidth multiline minRows={4} label="Descripcion" name="descripcion" value={values.descripcion} onBlur={handleBlur} onChange={handleChange} error={!!touched.descripcion && !!errors.descripcion} helperText={touched.descripcion && errors.descripcion} className="is-wide" />
                  <div className="medicine-upload is-wide">
                    <div className="medicine-upload-row">
                      <Tooltip title="Subir imagen">
                        <IconButton color="primary" aria-label="upload picture" component="label">
                          <input hidden name="imagen" type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => setFieldValue('imagen', event.currentTarget.files[0])} />
                          <AddAPhotoIcon />
                        </IconButton>
                      </Tooltip>
                      <div>
                        <strong>Imagen del medicamento</strong>
                        <p>Sube una foto clara del empaque o presentacion.</p>
                      </div>
                    </div>
                    <div>{errors.imagen ? <p className="medicine-upload-error">{errors.imagen}</p> : null}</div>
                    {values.imagen ? <PreviewFile width={88} height={88} file={values.imagen} /> : null}
                  </div>
                </div>

                <div className="medicine-form-actions">
                  <Button variant="outlined" onClick={handleClose}>Cancelar</Button>
                  <Button type="submit" variant="contained" className="primary-cta">Guardar medicamento</Button>
                </div>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>

      <Modal open={Boolean(selectedMedicamento)} onClose={closeMedicineDetail}>
        <Box className={`medicine-detail-modal ${isDark ? 'is-dark' : 'is-light'}`}>
          {selectedMedicamento && (
            <>
              <div className="medicine-detail-head">
                <div>
                  <span className="medicine-modal-kicker">Ficha completa</span>
                  <Typography component="h2" className="medicine-modal-title">{selectedMedicamento.nombreMedicamento}</Typography>
                  <p>Descripcion ampliada para saber rapidamente para que sirve, cuantas piezas tiene y cual es su dosis.</p>
                </div>
                <div className="medicine-detail-actions">
                  <Chip label={isEditing ? 'Modo edicion' : formatMedicineSummary(selectedMedicamento)} className="task-chip" />
                </div>
              </div>

              {isEditing ? (
                <>
                  <div className="medicine-form-grid medicine-edit-grid medicine-form-grid-expanded">
                    <TextField fullWidth label="Nombre del medicamento" value={medicineForm.nombreMedicamento} onChange={handleMedicineChange('nombreMedicamento')} />
                    <TextField fullWidth label="Cantidad de piezas" value={medicineForm.cantidadPresentacion} onChange={handleMedicineChange('cantidadPresentacion')} />
                    <TextField fullWidth select label="Tipo de presentacion" value={medicineForm.unidadPresentacion} onChange={handleMedicineChange('unidadPresentacion')}>
                      {presentationUnits.map((unidad) => (
                        <MenuItem key={unidad} value={unidad}>{unidad}</MenuItem>
                      ))}
                    </TextField>
                    <TextField fullWidth label="Dosis o medida" value={medicineForm.dosisCantidad} onChange={handleMedicineChange('dosisCantidad')} />
                    <TextField fullWidth select label="Unidad de dosis" value={medicineForm.dosisUnidad} onChange={handleMedicineChange('dosisUnidad')}>
                      {dosageUnits.map((unidad) => (
                        <MenuItem key={unidad} value={unidad}>{unidad}</MenuItem>
                      ))}
                    </TextField>
                    <TextField fullWidth multiline minRows={5} label="Descripcion" value={medicineForm.descripcion} onChange={handleMedicineChange('descripcion')} className="is-wide" />
                    <div className="medicine-upload is-wide">
                      <div className="medicine-upload-row">
                        <Tooltip title="Cambiar imagen">
                          <IconButton color="primary" aria-label="upload picture" component="label">
                            <input hidden type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleMedicineImage} />
                            <AddAPhotoIcon />
                          </IconButton>
                        </Tooltip>
                        <div>
                          <strong>Imagen actual</strong>
                          <p>{medicineForm.imagen ? medicineForm.imagen.name : medicineForm.imagenActual || 'Sin imagen registrada'}</p>
                        </div>
                      </div>
                      {medicineForm.imagen ? <PreviewFile width={96} height={96} file={medicineForm.imagen} /> : null}
                    </div>
                  </div>
                  <div className="medicine-detail-footer">
                    <div className="medicine-detail-footer-copy">
                      <small>Edicion activa</small>
                      <p>Guarda aqui los cambios nuevos del medicamento, incluida la imagen si la reemplazas.</p>
                    </div>
                    <div className="medicine-detail-footer-actions">
                      <Button
                        variant="outlined"
                        className="secondary-cta"
                        onClick={() => {
                          setIsEditing(false);
                          setMedicineForm(createMedicineForm(selectedMedicamento));
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        className="detail-save-btn"
                        startIcon={<SaveOutlinedIcon fontSize="small" />}
                        onClick={handleSaveMedicine}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Guardando...' : 'Guardar cambios'}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="medicine-detail-grid">
                    <div className="medicine-detail-media">
                      {detailImage ? (
                        <img src={detailImage} alt={selectedMedicamento.nombreMedicamento} />
                      ) : (
                        <div className="medicine-media medicine-media-fallback">Sin imagen</div>
                      )}
                    </div>
                    <div className="medicine-detail-copy">
                      <div className="medicine-detail-card medicine-detail-description">
                        <small>Descripcion</small>
                        <p>{selectedMedicamento.descripcion || 'Sin descripcion registrada.'}</p>
                      </div>
                      <div className="medicine-detail-meta medicine-detail-meta-expanded">
                        <div className="medicine-detail-card">
                          <small>Piezas</small>
                          <span>{getPresentationCount(selectedMedicamento) || '0'}</span>
                        </div>
                        <div className="medicine-detail-card">
                          <small>Presentacion</small>
                          <span>{getPresentationUnit(selectedMedicamento) || 'Sin unidad'}</span>
                        </div>
                        <div className="medicine-detail-card">
                          <small>Dosis</small>
                          <span>{getDosageCount(selectedMedicamento) || '0'}</span>
                        </div>
                        <div className="medicine-detail-card">
                          <small>Unidad de dosis</small>
                          <span>{getDosageUnit(selectedMedicamento) || 'Sin unidad'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="medicine-detail-footer">
                    <div className="medicine-detail-footer-copy">
                      <small>Acciones</small>
                      <p>Abre la edicion de esta ficha o cierrala cuando termines de revisarla.</p>
                    </div>
                    <div className="medicine-detail-footer-actions">
                      <Button variant="outlined" className="secondary-cta" onClick={closeMedicineDetail}>
                        Cerrar
                      </Button>
                      <Button variant="contained" className="detail-save-btn" startIcon={<EditOutlinedIcon fontSize="small" />} onClick={() => setIsEditing(true)}>
                        Editar ficha
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </Box>
      </Modal>
    </section>
  );
};

export default Medicamentos;
