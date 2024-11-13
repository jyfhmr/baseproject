"use client"
const columns = [
    {
      title: 'Fecha',
      dataIndex: 'dateE',
      key: 'dateE',
      type: 'date'
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
      dataIndex: 'exponent',
      key: 'exponent',
    },
    {
      title: 'Enlace',
      dataIndex: 'url',
      key: 'url',
      width: 30,
      // Aquí usas render para mostrar el enlace
      render: (text: string) => {
        if (text === "No Disponible") {
          return <div>Sin URL</div>; // Muestra "SIN URL" si el valor es "No Disponible"
        }
        return (
          <a href={text} target="_blank" rel="noopener noreferrer" color="#cf286a" style={{color: "#cf286a"}}>
            Ver Sentencia
          </a>
        );
      },
    }
    
  ];

  export default columns