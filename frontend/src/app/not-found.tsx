'use client'
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import GoPharma from '../../public/img/Logo-GoPharma-Rif-Vector.png';

export default function notFound() {

    function goBack() {
        window.history.back();
    }

    return (
        <main className="containerNotFound min-h-full place-items-center bg-white">
            <div className="text-center">
                <div className='container-img-error'>
                    <div className='container-img-not-found'>
                        <Image
                            src={GoPharma}
                            alt="GoPharma"
                            className='image-not-found'
                        />
                    </div>
                    <p className="text-base font-semibold text-indigo-600">404</p>
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Página no encontrada</h1>
                <p className="mt-6 text-base leading-7 text-gray-600">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <div
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

                        onClick={goBack}>
                        Regresar
                    </div>
                    <Link href="#" className="text-sm font-semibold text-gray-900">
                        Contactar con soporte <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </main>
    )
}
