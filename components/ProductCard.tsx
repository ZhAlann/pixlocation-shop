import Link from "next/link";
import { Product } from "@/types/product";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    return (
        <div className="px-product-card">
            <div className="px-product-img">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <span style={{ fontSize: 40, color: "#bbb" }}>📷</span>
                )}
            </div>

            <div className="px-product-body">
                <span className={`px-badge ${product.condition === "neuf" ? "px-badge-new" : "px-badge-used"}`}>
                    {product.condition === "neuf" ? "Neuf" : "Occasion"}
                </span>

                <div className="px-product-name">{product.name}</div>

                <div style={{ fontSize: 11, color: "#888", textTransform: "capitalize" }}>
                    {product.category}
                </div>

                <div className="px-product-price">{product.price.toLocaleString("fr-FR")} €</div>

                {product.stock <= 2 && product.stock > 0 && (
                    <div style={{ fontSize: 11, color: "#e65100", fontWeight: 600 }}>
                        Plus que {product.stock} en stock !
                    </div>
                )}
                {product.stock === 0 && (
                    <div style={{ fontSize: 11, color: "#c62828", fontWeight: 600 }}>
                        Rupture de stock
                    </div>
                )}

                <Link
                    href={`/product/${product.id}`}
                    className="px-btn px-btn-dark"
                    style={{ marginTop: "auto", textAlign: "center" }}
                >
                    Consulter
                </Link>
            </div>
        </div>
    );
}
