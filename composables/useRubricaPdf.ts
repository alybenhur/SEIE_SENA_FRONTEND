// Composable para descargar en PDF la rúbrica de evaluación de un proyecto,
// con los datos del evaluador y la descripción de cada criterio.
export function useRubricaPdf() {
  const { get } = useApi()
  const generandoPdf = ref<string | null>(null)

  const modalidadLabels: Record<string, string> = {
    poster: 'Póster o Cartel',
    poster_prototipo: 'Póster y Prototipo',
    ponencia: 'Conferencia o Ponencia',
  }

  const EVENTO_IMG_URL =
    'https://res.cloudinary.com/dsdfju4il/image/upload/w_400,q_auto/v1780266830/investigacion/sa1uchvx8h9p7nsmwksz.jpg'

  function loadImagen(src: string): Promise<{ dataUrl: string; w: number; h: number } | null> {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        try {
          const c = document.createElement('canvas')
          c.width = img.naturalWidth; c.height = img.naturalHeight
          c.getContext('2d')!.drawImage(img, 0, 0)
          resolve({ dataUrl: c.toDataURL('image/jpeg', 0.9), w: img.naturalWidth, h: img.naturalHeight })
        } catch { resolve(null) }
      }
      img.onerror = () => resolve(null)
      img.src = src
    })
  }

  function autoresDe(p: any): string {
    const nombres = (p?.autoresPrincipales?.length
      ? p.autoresPrincipales.map((a: any) => a?.nombreCompleto)
      : [p?.autorRef?.nombreCompleto]).filter(Boolean)
    return nombres.length ? nombres.join(', ') : '—'
  }
  function instructorDe(p: any): string {
    const nombres = (p?.autoresDocentes ?? []).map((a: any) => a?.nombreCompleto).filter(Boolean)
    return nombres.length ? nombres.join(', ') : '—'
  }

  async function descargarRubricaPdf(p: any) {
    generandoPdf.value = p._id
    try {
      const [{ jsPDF }, autoTableMod] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
      const autoTable = (autoTableMod as any).default

      const evals = (await get<any[]>(`/evaluaciones/proyecto/${p._id}`)) ?? []
      const enviadas = evals.filter((e: any) => e.estado === 'enviada')
      const lista = enviadas.length ? enviadas : evals

      // Descripciones de los criterios según la rúbrica de la modalidad
      const descPorNombre: Record<string, string> = {}
      const modalidad = p.modalidadParticipacion || 'poster'
      try {
        const rub = await get<any>(`/rubricas/${modalidad}`)
        ;(rub?.criterios || []).forEach((c: any) => { descPorNombre[c.nombre] = c.descripcion })
      } catch { /* si no hay rúbrica, se omite la descripción */ }

      const doc = new jsPDF({ unit: 'mm', format: 'a4' })
      const W = doc.internal.pageSize.getWidth()
      const H = doc.internal.pageSize.getHeight()
      const M = 14
      let y = 0
      const ensure = (need: number) => { if (y + need > H - 14) { doc.addPage(); y = 18 } }

      // Cabecera
      const bandH = 28
      doc.setFillColor(30, 92, 42); doc.rect(0, 0, W, bandH, 'F')
      let textX = M
      const logo = await loadImagen(EVENTO_IMG_URL)
      if (logo) {
        const imgH = bandH - 6
        const imgW = Math.min(imgH * (logo.w / logo.h), 34)
        doc.addImage(logo.dataUrl, 'JPEG', M, 3, imgW, imgH)
        textX = M + imgW + 5
      }
      const nombreEvento = p.eventoRef?.nombre || 'Encuentro Zonal de Semilleros de Investigación 2026'
      doc.setTextColor(255); doc.setFont('helvetica', 'bold'); doc.setFontSize(15)
      doc.text('Evaluación de proyecto', textX, 12)
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9)
      const et = doc.splitTextToSize(nombreEvento, W - textX - M)
      doc.text(et, textX, 19)
      y = bandH + 8

      // Título del proyecto
      doc.setTextColor(20); doc.setFont('helvetica', 'bold'); doc.setFontSize(12)
      const tit = doc.splitTextToSize(p.titulo || '', W - 2 * M)
      doc.text(tit, M, y); y += tit.length * 6 + 3

      // Información
      doc.setFontSize(9)
      const info: [string, string][] = [
        ['Modalidad', modalidadLabels[p.modalidadParticipacion] || '—'],
        ['Línea de trabajo', p.lineaInvestigacion || '—'],
        ['Regional', p.regional || '—'],
        ['Institución', p.institucion || '—'],
        ['Instructor', instructorDe(p)],
        ['Autores', autoresDe(p)],
      ]
      for (const [k, v] of info) {
        doc.setFont('helvetica', 'bold'); const kl = `${k}: `; const kw = doc.getTextWidth(kl)
        doc.text(kl, M, y)
        doc.setFont('helvetica', 'normal')
        const vt = doc.splitTextToSize(String(v), W - 2 * M - kw)
        doc.text(vt, M + kw, y)
        y += Math.max(vt.length, 1) * 5
      }
      y += 3

      // Nota final
      ensure(10)
      doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(30, 92, 42)
      doc.text(`Nota final del proyecto: ${p.puntajeFinal ?? '—'} / 100`, M, y)
      doc.setTextColor(20); y += 8

      if (!lista.length) {
        doc.setFont('helvetica', 'italic'); doc.setFontSize(10)
        doc.text('Este proyecto aún no tiene evaluaciones registradas.', M, y)
      }

      for (const ev of lista) {
        ensure(20)
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10)
        doc.text(`Evaluador: ${ev.evaluadorRef?.nombreCompleto || '—'}`, M, y); y += 2

        autoTable(doc, {
          startY: y + 2,
          head: [['Criterio (qué se evalúa)', 'Puntaje', 'Observación']],
          body: (ev.criterios || []).map((c: any) => {
            const desc = descPorNombre[c.nombre]
            const criterio = desc ? `${c.nombre}\n${desc}` : c.nombre
            return [criterio, `${c.puntaje}`, c.observacion || '']
          }),
          styles: { fontSize: 7.5, cellPadding: 2, valign: 'top' },
          headStyles: { fillColor: [30, 92, 42], textColor: 255, fontSize: 8 },
          columnStyles: { 0: { cellWidth: 104 }, 1: { halign: 'center', cellWidth: 16 }, 2: { cellWidth: 62 } },
          margin: { left: M, right: M },
          // Nombre del criterio en negrita, descripción en gris
          didParseCell: (data: any) => {
            if (data.section === 'body' && data.column.index === 0 && typeof data.cell.raw === 'string' && data.cell.raw.includes('\n')) {
              data.cell.styles.fontSize = 7.5
            }
          },
        })
        y = (doc as any).lastAutoTable.finalY + 6

        ensure(8)
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10)
        doc.text(`Puntaje total: ${ev.puntajeTotal ?? 0} / 100`, M, y); y += 7

        if (ev.observacionGeneral) {
          const t = doc.splitTextToSize(ev.observacionGeneral, W - 2 * M)
          ensure(6 + t.length * 5)
          doc.setFont('helvetica', 'bold'); doc.text('Observación general:', M, y); y += 5
          doc.setFont('helvetica', 'normal'); doc.text(t, M, y); y += t.length * 5 + 2
        }
        if (ev.recomendaciones) {
          const t = doc.splitTextToSize(ev.recomendaciones, W - 2 * M)
          ensure(6 + t.length * 5)
          doc.setFont('helvetica', 'bold'); doc.text('Recomendaciones:', M, y); y += 5
          doc.setFont('helvetica', 'normal'); doc.text(t, M, y); y += t.length * 5 + 2
        }
        y += 4
      }

      doc.save(`Evaluacion - ${(p.titulo || 'proyecto').substring(0, 40)}.pdf`)
    } catch (e) {
      console.error('Error al generar PDF:', e)
    } finally {
      generandoPdf.value = null
    }
  }

  return { descargarRubricaPdf, generandoPdf, modalidadLabels }
}
