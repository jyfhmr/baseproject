export const getQuery = (searchParams: any) =>
    Object.keys(searchParams).length
        ? '?' +
          Object.keys(searchParams)
              .map((key) => `${key}=${searchParams[key]}`)
              .join('&')
        : '';

export const formatDate = (date: Date) =>
    new Date(date).toLocaleString('es-VE', {
        timeZone: 'America/Caracas',
    });

export const getFormData = (object: any) =>
    Object.keys(object).reduce((formData, key) => {
        if (typeof object[key] === 'object' && object[key] !== null) {
            // Convierte el objeto a una cadena JSON antes de añadirlo a FormData
            formData.append(key, JSON.stringify(object[key]));
        } else {
            formData.append(key, object[key]);
        }
        return formData;
    }, new FormData());

export const getPropertyOnObj = (path: any, obj: any = null, self: any = null) => {
    return path.split('.').reduce(function (prev: any, curr: any) {
        return prev ? prev[curr] : null;
    }, obj || self);
};
