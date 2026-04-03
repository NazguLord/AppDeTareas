import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Chip, Tab, Tabs } from '@mui/material';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PieChart from '../Components/PieChart';
import CategoryBarChart from '../Components/CategoryBarChart';
import YearTrendChart from '../Components/YearTrendChart';
import api from '../api';
import './AudioCharts.scss';

const buildCountData = (items = [], fieldName, fallbackLabel) => {
  const counts = {};

  items.forEach((item) => {
    const rawValue = item?.[fieldName];
    const normalized = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
    const label = normalized ? normalized : fallbackLabel;
    counts[label] = (counts[label] || 0) + 1;
  });

  return Object.keys(counts).map((label) => ({
    id: label,
    label,
    value: counts[label],
  }));
};

const getYearLabel = (value) => {
  if (!value) {
    return null;
  }

  const match = `${value}`.match(/^(\d{4})/);
  return match ? match[1] : null;
};

const buildYearData = (items = []) => {
  const counts = {};

  items.forEach((item) => {
    const year = getYearLabel(item?.fecha);
    if (!year) {
      return;
    }

    counts[year] = (counts[year] || 0) + 1;
  });

  return Object.keys(counts)
    .sort((a, b) => Number(a) - Number(b))
    .map((year) => ({
      id: year,
      label: year,
      value: counts[year],
    }));
};

const buildDecadeData = (items = []) => {
  const counts = {};

  items.forEach((item) => {
    const year = Number(item?.label || item?.id);
    if (!Number.isFinite(year)) {
      return;
    }

    const decadeStart = Math.floor(year / 10) * 10;
    const decadeLabel = `${decadeStart}s`;
    counts[decadeLabel] = (counts[decadeLabel] || 0) + Number(item?.value || 0);
  });

  return Object.keys(counts)
    .sort((a, b) => Number(a.replace('s', '')) - Number(b.replace('s', '')))
    .map((decade) => ({
      id: decade,
      label: decade,
      value: counts[decade],
    }));
};

const getTopEntry = (items = []) => [...items].sort((a, b) => Number(b.value || 0) - Number(a.value || 0))[0];
const getTotalValue = (items = []) => items.reduce((acc, item) => acc + Number(item.value || 0), 0);
const getShare = (value, total) => (total ? Math.round((value / total) * 100) : 0);

const Pie = () => {
  const [typeChartData, setTypeChartData] = useState([]);
  const [genreChartData, setGenreChartData] = useState([]);
  const [yearChartData, setYearChartData] = useState([]);
  const [bandChartData, setBandChartData] = useState([]);
  const [activeTab, setActiveTab] = useState('distribution');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await api.get('/audios');
        setTypeChartData(buildCountData(res.data, 'tipo', 'Sin clasificar'));
        setGenreChartData(buildCountData(res.data, 'genero', 'Sin genero asignado'));
        setYearChartData(buildYearData(res.data));
        setBandChartData(buildCountData(res.data, 'nombreBanda', 'Sin banda'));
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllData();
  }, []);

  const typeStats = useMemo(() => {
    const total = getTotalValue(typeChartData);
    const topCategory = getTopEntry(typeChartData);

    return [
      {
        icon: <LibraryMusicOutlinedIcon fontSize="small" />,
        label: 'Registros',
        value: `${total}`,
        copy: 'Audios contados dentro del analisis por categoria',
      },
      {
        icon: <PieChartOutlineOutlinedIcon fontSize="small" />,
        label: 'Categorias',
        value: `${typeChartData.length}`,
        copy: 'Tipos distintos detectados en la coleccion',
      },
      {
        icon: <InsightsOutlinedIcon fontSize="small" />,
        label: 'Mayor grupo',
        value: topCategory?.label || 'Sin datos',
        copy: topCategory ? `${topCategory.value} registros en la categoria dominante` : 'Aun no hay suficientes datos',
      },
    ];
  }, [typeChartData]);

  const genreStats = useMemo(() => {
    const total = getTotalValue(genreChartData);
    const topGenreValue = getTopEntry(genreChartData);

    return [
      {
        icon: <AlbumOutlinedIcon fontSize="small" />,
        label: 'Registros con genero',
        value: `${total}`,
        copy: 'Conciertos leidos dentro del resumen por genero',
      },
      {
        icon: <CategoryOutlinedIcon fontSize="small" />,
        label: 'Generos',
        value: `${genreChartData.length}`,
        copy: 'Etiquetas de genero detectadas en la biblioteca',
      },
      {
        icon: <InsightsOutlinedIcon fontSize="small" />,
        label: 'Genero dominante',
        value: topGenreValue?.label || 'Sin datos',
        copy: topGenreValue ? `${topGenreValue.value} conciertos dentro del genero principal` : 'Aun no hay suficientes datos',
      },
    ];
  }, [genreChartData]);

  const topGenre = useMemo(() => getTopEntry(genreChartData), [genreChartData]);
  const topGenres = useMemo(() => [...genreChartData].sort((a, b) => b.value - a.value).slice(0, 5), [genreChartData]);
  const topTypes = useMemo(() => [...typeChartData].sort((a, b) => b.value - a.value).slice(0, 4), [typeChartData]);
  const yearRange = useMemo(() => {
    if (!yearChartData.length) {
      return null;
    }

    return {
      first: yearChartData[0]?.label,
      last: yearChartData[yearChartData.length - 1]?.label,
    };
  }, [yearChartData]);
  const peakYear = useMemo(() => getTopEntry(yearChartData), [yearChartData]);
  const decadeChartData = useMemo(() => buildDecadeData(yearChartData), [yearChartData]);
  const topDecade = useMemo(() => getTopEntry(decadeChartData), [decadeChartData]);
  const topBands = useMemo(() => [...bandChartData].sort((a, b) => b.value - a.value).slice(0, 10), [bandChartData]);
  const leadingBand = useMemo(() => topBands[0], [topBands]);
  const totalConcertsWithYear = useMemo(() => getTotalValue(yearChartData), [yearChartData]);
  const totalBandRecords = useMemo(() => getTotalValue(bandChartData), [bandChartData]);
  const topFiveBandTotal = useMemo(() => getTotalValue(topBands.slice(0, 5)), [topBands]);
  const topTenBandTotal = useMemo(() => getTotalValue(topBands), [topBands]);
  const topFiveBandShare = useMemo(() => getShare(topFiveBandTotal, totalBandRecords), [topFiveBandTotal, totalBandRecords]);
  const topTenBandShare = useMemo(() => getShare(topTenBandTotal, totalBandRecords), [topTenBandTotal, totalBandRecords]);
  const remainingBandTotal = useMemo(() => Math.max(totalBandRecords - topTenBandTotal, 0), [totalBandRecords, topTenBandTotal]);
  const remainingBandShare = useMemo(() => Math.max(100 - topTenBandShare, 0), [topTenBandShare]);
  const nextFiveBandShare = useMemo(() => Math.max(topTenBandShare - topFiveBandShare, 0), [topFiveBandShare, topTenBandShare]);

  const overviewStats = useMemo(
    () => [
      {
        icon: <LibraryMusicOutlinedIcon fontSize="small" />,
        label: 'Registros',
        value: `${typeStats[0]?.value || 0}`,
        copy: 'Total de audios',
      },
      {
        icon: <CategoryOutlinedIcon fontSize="small" />,
        label: 'Generos',
        value: `${genreChartData.length}`,
        copy: topGenre ? `${topGenre.label} lidera` : 'Sin lider actual',
      },
      {
        icon: <CalendarMonthOutlinedIcon fontSize="small" />,
        label: 'Rango historico',
        value: yearRange ? `${yearRange.first} - ${yearRange.last}` : 'Sin fechas',
        copy: peakYear ? `${peakYear.label} marca el pico` : 'Sin cronologia suficiente',
      },
      {
        icon: <GroupsOutlinedIcon fontSize="small" />,
        label: 'Banda top',
        value: leadingBand?.label || 'Sin datos',
        copy: leadingBand ? `${leadingBand.value} bootlegs` : 'Sin ranking disponible',
      },
    ],
    [genreChartData.length, leadingBand, peakYear, topGenre, typeStats, yearRange]
  );

  return (
    <section className="audio-chart-page task-page">
      <div className="audio-chart-hero task-hero compact-hero">
        <div className="task-hero-copy">
          <span className="eyebrow">Analitica</span>
          <h1>Analitica de audios</h1>
          <p>Una lectura mas clara de la biblioteca para entender su distribucion por tipo, genero, años y bandas con mayor numero de bootlegs.</p>
        </div>
        <div className="task-hero-actions compact-actions">
          <Button variant="outlined" className="secondary-cta" component={Link} to="/audios">
            Volver a audios
          </Button>
          <Chip label={`${typeChartData.length} tipos`} className="task-chip" />
          <Chip label={`${genreChartData.length} generos`} className="task-chip" />
          <Chip label={`${yearChartData.length} años`} className="task-chip" />
        </div>
      </div>

      <div className="audio-chart-dashboard-shell">
        <div className="audio-chart-topbar-tabs">
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            className="audio-chart-tabs"
          >
            <Tab label="Resumen" value="overview" />
            <Tab label="Distribucion" value="distribution" />
            <Tab label="Cronologia" value="timeline" />
            <Tab label="Bandas" value="bands" />
          </Tabs>
        </div>

        <div className="audio-chart-summary-strip">
          {overviewStats.map((stat) => (
            <div className="audio-chart-summary-card" key={`overview-${stat.label}`}>
              <span className="audio-chart-summary-icon">{stat.icon}</span>
              <div className="audio-chart-summary-body">
                <span className="audio-chart-summary-label">{stat.label}</span>
                <strong className="audio-chart-summary-value">{stat.value}</strong>
                <span className="audio-chart-summary-copy">{stat.copy}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="audio-chart-tab-panel">
          {activeTab === 'overview' ? (
            <div className="audio-chart-section overview-shell">
              <div className="audio-chart-shell-head task-section-head compact-head">
                <div>
                  <span className="section-kicker">Resumen</span>
                  <h2>Panorama general</h2>
                </div>
                <p>Usa las pestanias de arriba para saltar directo a la lectura que quieras sin bajar por toda la pagina.</p>
              </div>

              <div className="overview-layout">
                <div className="overview-column">
                  <div className="audio-chart-tags compact-overview-grid">
                    <div className="audio-chart-tag">
                      <span className="audio-chart-tag-label">Distribucion</span>
                      <strong className="audio-chart-tag-value">Tipos y generos</strong>
                      <span className="audio-chart-tag-copy">Compara la mezcla general del archivo por categoria y genero.</span>
                    </div>
                    <div className="audio-chart-tag">
                      <span className="audio-chart-tag-label">Cronologia</span>
                      <strong className="audio-chart-tag-value">Serie por año</strong>
                      <span className="audio-chart-tag-copy">Revisa el comportamiento historico completo en una sola vista.</span>
                    </div>
                    <div className="audio-chart-tag">
                      <span className="audio-chart-tag-label">Bandas</span>
                      <strong className="audio-chart-tag-value">Ranking principal</strong>
                      <span className="audio-chart-tag-copy">Detecta rapido que bandas dominan la biblioteca de audios.</span>
                    </div>
                  </div>
                </div>

                <div className="overview-column">
                  <div className="audio-chart-canvas audio-chart-panel overview-highlight-panel">
                    <div className="audio-chart-panel-head">
                      <strong>Focos actuales</strong>
                      <span>Los datos mas fuertes que hoy resumen mejor el archivo</span>
                    </div>

                    <div className="audio-chart-tags overview-highlight-grid">
                      <div className="audio-chart-tag">
                        <span className="audio-chart-tag-label">Categoria lider</span>
                        <strong className="audio-chart-tag-value">{typeStats[2]?.value || 'Sin datos'}</strong>
                        <span className="audio-chart-tag-copy">{typeStats[2]?.copy || 'Sin lectura disponible'}</span>
                      </div>
                      <div className="audio-chart-tag">
                        <span className="audio-chart-tag-label">Genero lider</span>
                        <strong className="audio-chart-tag-value">{topGenre?.label || 'Sin datos'}</strong>
                        <span className="audio-chart-tag-copy">{topGenre ? `${topGenre.value} conciertos registrados` : 'Sin lectura disponible'}</span>
                      </div>
                      <div className="audio-chart-tag">
                        <span className="audio-chart-tag-label">Pico historico</span>
                        <strong className="audio-chart-tag-value">{peakYear ? `${peakYear.label}` : 'Sin datos'}</strong>
                        <span className="audio-chart-tag-copy">{peakYear ? `${peakYear.value} conciertos en el año mas alto` : 'Sin lectura disponible'}</span>
                      </div>
                      <div className="audio-chart-tag">
                        <span className="audio-chart-tag-label">Banda lider</span>
                        <strong className="audio-chart-tag-value">{leadingBand?.label || 'Sin datos'}</strong>
                        <span className="audio-chart-tag-copy">{leadingBand ? `${leadingBand.value} bootlegs dentro del ranking principal` : 'Sin lectura disponible'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overview-preview-grid">
                <div className="audio-chart-canvas audio-chart-panel compact-bar-view">
                  <div className="audio-chart-panel-head">
                    <strong>Preview de distribucion</strong>
                    <span>Las cuatro categorias que mas pesan en el archivo</span>
                  </div>
                  <CategoryBarChart data={topTypes} preserveOrder minHeight={220} />
                </div>

                <div className="audio-chart-canvas audio-chart-panel compact-bar-view">
                  <div className="audio-chart-panel-head">
                    <strong>Preview historico</strong>
                    <span>{topDecade ? `${topDecade.label} domina el recorrido por decadas` : 'Lectura por bloques historicos'}</span>
                  </div>
                  <CategoryBarChart data={decadeChartData} preserveOrder minHeight={220} />
                </div>

                <div className="audio-chart-canvas audio-chart-panel compact-bar-view">
                  <div className="audio-chart-panel-head">
                    <strong>Preview de bandas</strong>
                    <span>{leadingBand ? `${leadingBand.label} abre el ranking actual` : 'Ranking rapido de presencia por banda'}</span>
                  </div>
                  <CategoryBarChart data={topBands.slice(0, 5)} preserveOrder minHeight={220} />
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'distribution' ? (
            <div className="audio-chart-section">
              <div className="audio-chart-shell-head task-section-head compact-head">
                <div>
                  <span className="section-kicker">Visualizacion</span>
                  <h2>Distribucion por categoria</h2>
                </div>
                <p>Revisa primero la composicion por tipo para entender rapidamente la base del archivo.</p>
              </div>

              <div className="audio-chart-grid">
                <div className="audio-chart-left-col">
                  <div className="audio-chart-canvas pie-view audio-chart-panel">
                    <div className="audio-chart-panel-head">
                      <strong>Vista general</strong>
                      <span>Participacion por tipo</span>
                    </div>
                    <PieChart data={typeChartData} />
                  </div>
                </div>

                <div className="audio-chart-canvas bar-view audio-chart-panel">
                  <div className="audio-chart-panel-head">
                    <strong>Lectura comparativa</strong>
                    <span>Registros ordenados de mayor a menor</span>
                  </div>
                  <CategoryBarChart data={typeChartData} />
                </div>
              </div>

              <div className="audio-chart-divider" />

              <div className="audio-chart-shell-head task-section-head compact-head section-gap-top">
                <div>
                  <span className="section-kicker">Genero</span>
                  <h2>Distribucion por genero</h2>
                </div>
                <p>
                  {topGenre
                    ? `${topGenre.label} es el genero con mas conciertos registrados en esta vista.`
                    : 'Asigna generos a tus conciertos para desbloquear esta comparativa.'}
                </p>
              </div>

              <div className="audio-chart-grid">
                <div className="audio-chart-left-col">
                  <div className="audio-chart-canvas pie-view audio-chart-panel">
                    <div className="audio-chart-panel-head">
                      <strong>Vista general</strong>
                      <span>Participacion por genero musical</span>
                    </div>
                    <PieChart data={genreChartData} />
                  </div>

                  <div className="audio-chart-canvas audio-chart-insights audio-chart-panel">
                    <div className="audio-chart-panel-head">
                      <strong>Lectura rapida</strong>
                      <span>Los cinco generos con mayor presencia</span>
                    </div>

                    <div className="audio-chart-tags">
                      {topGenres.map((item) => (
                        <div className="audio-chart-tag" key={`genre-tag-${item.id}`}>
                          <span className="audio-chart-tag-label">{item.id}</span>
                          <strong className="audio-chart-tag-value">{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="audio-chart-canvas bar-view audio-chart-panel">
                  <div className="audio-chart-panel-head">
                    <strong>Lectura comparativa</strong>
                    <span>Generos ordenados de mayor a menor</span>
                  </div>
                  <CategoryBarChart data={genreChartData} />
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'timeline' ? (
            <div className="audio-chart-section">
              <div className="audio-chart-shell-head task-section-head compact-head">
                <div>
                  <span className="section-kicker">Cronologia</span>
                  <h2>Conciertos por año</h2>
                </div>
                <p>
                  {peakYear
                    ? `El pico actual esta en ${peakYear.label} con ${peakYear.value} conciertos registrados.${yearRange ? ` El rango visible va de ${yearRange.first} a ${yearRange.last}.` : ''}`
                    : 'Agrega fechas validas en los audios para desbloquear esta lectura cronologica.'}
                </p>
              </div>

              <div className="audio-chart-grid">
                <div className="audio-chart-left-col">
                  <div className="audio-chart-canvas audio-chart-insights audio-chart-panel">
                    <div className="audio-chart-panel-head">
                      <strong>Resumen del periodo</strong>
                      <span>Lo que ya se puede leer del archivo historico</span>
                    </div>

                    <div className="audio-chart-tags">
                      <div className="audio-chart-tag">
                        <span className="audio-chart-tag-label">Conciertos con año identificable</span>
                        <strong className="audio-chart-tag-value">{totalConcertsWithYear}</strong>
                      </div>
                      <div className="audio-chart-tag">
                        <span className="audio-chart-tag-label">Primer año detectado</span>
                        <strong className="audio-chart-tag-value">{yearRange?.first || 'Sin datos'}</strong>
                      </div>
                      <div className="audio-chart-tag">
                        <span className="audio-chart-tag-label">Ultimo año detectado</span>
                        <strong className="audio-chart-tag-value">{yearRange?.last || 'Sin datos'}</strong>
                      </div>
                      <div className="audio-chart-tag">
                        <span className="audio-chart-tag-label">Año con mas conciertos</span>
                        <strong className="audio-chart-tag-value">{peakYear ? `${peakYear.label} (${peakYear.value})` : 'Sin datos'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="audio-chart-canvas audio-chart-panel compact-bar-view">
                    <div className="audio-chart-panel-head">
                      <strong>Conciertos por decada</strong>
                      <span>Resumen agrupado para leer el peso historico por bloques</span>
                    </div>
                    <CategoryBarChart data={decadeChartData} preserveOrder minHeight={280} />
                    {topDecade ? (
                      <div className="audio-chart-tags">
                        <div className="audio-chart-tag">
                          <span className="audio-chart-tag-label">Decada dominante</span>
                          <strong className="audio-chart-tag-value">{topDecade.label}</strong>
                          <span className="audio-chart-tag-copy">{`${topDecade.value} conciertos agrupados en el bloque mas fuerte`}</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="audio-chart-canvas trend-view audio-chart-panel">
                  <div className="audio-chart-panel-head">
                    <strong>Lectura cronologica</strong>
                    <span>Tendencia completa del conteo anual sin extender la pantalla</span>
                  </div>
                  <YearTrendChart data={yearChartData} />
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'bands' ? (
            <div className="audio-chart-section">
              <div className="audio-chart-shell-head task-section-head compact-head">
                <div>
                  <span className="section-kicker">Bandas</span>
                  <h2>Bandas con mas bootlegs de audio</h2>
                </div>
                <p>
                  {leadingBand
                    ? `${leadingBand.label} lidera actualmente el archivo con ${leadingBand.value} bootlegs de audio registrados.`
                    : 'Aun no hay suficientes datos para construir el ranking de bandas.'}
                </p>
              </div>

              <div className="audio-chart-grid">
                <div className="audio-chart-left-col">
                  <div className="audio-chart-canvas audio-chart-insights audio-chart-panel">
                    <div className="audio-chart-panel-head">
                      <strong>Top 5</strong>
                      <span>Bandas con mayor presencia en la biblioteca</span>
                    </div>

                    <div className="audio-chart-tags">
                      {topBands.slice(0, 5).map((item) => (
                        <div className="audio-chart-tag" key={`band-tag-${item.id}`}>
                          <span className="audio-chart-tag-label">{item.id}</span>
                          <strong className="audio-chart-tag-value">{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="audio-chart-canvas audio-chart-panel band-share-panel">
                    <div className="audio-chart-panel-head">
                      <strong>Concentracion del ranking</strong>
                      <span>Cuanto del archivo se lo lleva el top 5, el top 10 y el resto</span>
                    </div>

                    <div className="audio-chart-share-track" aria-label="Distribucion del ranking de bandas">
                      <span className="audio-chart-share-segment is-top-five" style={{ width: `${topFiveBandShare}%` }} />
                      <span className="audio-chart-share-segment is-next-five" style={{ width: `${nextFiveBandShare}%` }} />
                      <span className="audio-chart-share-segment is-rest" style={{ width: `${remainingBandShare}%` }} />
                    </div>

                    <div className="audio-chart-tags band-share-grid">
                      <div className="audio-chart-tag">
                        <span className="audio-chart-tag-label">Top 5</span>
                        <strong className="audio-chart-tag-value">{topFiveBandShare}%</strong>
                        <span className="audio-chart-tag-copy">{`${topFiveBandTotal} bootlegs concentrados en las cinco bandas mas fuertes`}</span>
                      </div>
                      <div className="audio-chart-tag">
                        <span className="audio-chart-tag-label">Top 10</span>
                        <strong className="audio-chart-tag-value">{topTenBandShare}%</strong>
                        <span className="audio-chart-tag-copy">{`${topTenBandTotal} bootlegs dentro del ranking ampliado`}</span>
                      </div>
                      <div className="audio-chart-tag">
                        <span className="audio-chart-tag-label">Resto</span>
                        <strong className="audio-chart-tag-value">{remainingBandShare}%</strong>
                        <span className="audio-chart-tag-copy">{`${remainingBandTotal} bootlegs fuera del top 10`}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="audio-chart-canvas bar-view audio-chart-panel">
                  <div className="audio-chart-panel-head">
                    <strong>Ranking de bandas</strong>
                    <span>Top 10 ordenado de mayor a menor</span>
                  </div>
                  <CategoryBarChart data={topBands} preserveOrder maxItems={10} />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Pie;
