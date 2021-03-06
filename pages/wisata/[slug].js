import React from 'react'
import { createClient } from "contentful";
import { Container } from 'react-bootstrap';
import { Image } from 'react-bootstrap';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
})

export const getStaticPaths = async() => {
    const res = await client.getEntries({
        content_type: 'wisata'
    })

    const paths = res.items.map(item => {
        return {
            params: { slug: item.fields.slug}
        }
    })
    return {
        paths,
        fallback: false,

    }
}

export const getStaticProps = async ({ params }) => {
    const { items } = await client.getEntries({
        content_type: 'wisata',
        'fields.slug': params.slug
    })

    return {
        props: { wisata: items[0]}
    }
}

export default function WisataDetails( { wisata }) {
    const { featured, judul, deskripsi } = wisata.fields 
    return (
        <div className='container'>
            <section>
                <Image
                src={'https:' + featured.fields.file.url}
                width={featured.fields.file.details.image.width}
                height={featured.fields.file.details.image.height}
                layout='intrinsic'
                alt='Foto Produk'
                />
                <h2>{ judul }</h2>
                <div>{documentToReactComponents(deskripsi)}</div>
            </section>
            <style jsx>{`
                .container {
                    display: flex; // make us of Flexbox
                    align-items: center; // does vertically center the desired content
                    justify-content: center; // horizontally centers single line items
                    text-align: center; 
                }
                
                .image {
                    max-height: 50%;
                }
                
                .text {
                    text-align: justify;
                }
            `}
            </style>
        </div>
    )
}
