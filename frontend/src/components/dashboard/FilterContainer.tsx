'use client'
import FilterComponet from './FilterComponet';
import { useRouter } from 'next/navigation';

export default function FilterContainer({ columns, moduleName }: any) {
    const router = useRouter();
    const handleFilter = async (filters: any) => {

        // Construir los parámetros de la URL
        const params = new URLSearchParams();

        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined) {
                if (Array.isArray(filters[key])) {
                    // Manejar rango de fechas
                    const startDate = new Date(filters[key][0]);
                    startDate.setHours(0, 0, 0, 0);

                    const endDate = new Date(filters[key][1]);
                    endDate.setHours(23, 59, 59, 999);

                    const startDateLocal = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
                    const endDateLocal = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);

                    params.append(key, `${startDateLocal.toISOString()},${endDateLocal.toISOString()}`);
                } else {
                    params.append(key, filters[key]);
                }
            }
        });

        // Navegar a la página con los parámetros
        const url = `${process.env.NEXT_PUBLIC_URL_FRONTEND}/dashboard/${moduleName}?${params.toString()}`;
        router.push(url);
    };

    return <FilterComponet columns={columns} onFilter={handleFilter} />
}
