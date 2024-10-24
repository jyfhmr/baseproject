// services/sentenceService.ts
export const formatSentences = (monthData: any[]) => {
    if (!monthData || monthData.length === 0) {
      return null;
    }
  
    // Formatear los datos sin JSX
    return monthData.flatMap((day) =>
      day.sentences.map((sentence: any) => ({
        ...sentence,
        date: day.date,
        url_content: sentence.url_content, // Solo la URL sin JSX
      }))
    );
  };
  