"use client"
const columns = [
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Número de Sentencia',
      dataIndex: 'sentence_number',
      key: 'sentence_number',
    },
    {
      title: 'Número de Expediente',
      dataIndex: 'proceedings_number',
      key: 'proceedings_number',
    },
    {
      title: 'Tipo de Procedimiento',
      dataIndex: 'proceedings_type',
      key: 'proceedings_type',
    },
    {
      title: 'Partes',
      dataIndex: 'parts',
      key: 'parts',
      render: (text: string) => (
        <div className="choicesStyles">
          {text}
        </div>
      ),
    },
    {
      title: 'Decisión',
      dataIndex: 'choice',
      key: 'choice',
      render: (text: string) => (
        <div className="choicesStyles">
          {text}
        </div>
      ),
    },
    {
      title: 'Ponente',
      dataIndex: 'speaker',
      key: 'speaker',
    },
    {
      title: 'Enlace',
      dataIndex: 'url_content',
      key: 'url_content',
      width: 30,
      // Aquí usas render para mostrar el enlace
      render: (text: string) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          Ver Sentencia
        </a>
      ),
    },
  ];

  export default columns