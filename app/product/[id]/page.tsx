type ProductPageProps = {
    params: {
        id: string;
    };
};

export default function ProductPage({ params }: ProductPageProps) {
    return (
        <main className="p-10">
            <h1 className="text-3xl font-bold">Produit : {params.id}</h1>
        </main>
    );
}