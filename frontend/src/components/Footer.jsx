import React from "react";
import { Link } from "react-router-dom";

const chunkArray = (array, size) => {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
};

const groupByCategory = (data) => {
    if (!Array.isArray(data)) {
        return {};
    }
    return data.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});
};

const Footer = ({ data }) => {
    const validData = Array.isArray(data) ? data : [];
    const groupedData = groupByCategory(validData);

    return (
        <footer className="text-white bg-blue body-font">
            <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
                <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
                    <a className="flex title-font font-medium items-center md:justify-start justify-center text-white">
                        <span className="ml-3 text-xl">Nana Store</span>
                    </a>
                    <p className="mt-2 text-sm text-white">
                        Nana Store menawarkan solusi top up game dan voucher yang cepat, mudah, dan terpercaya untuk berbagai platform gaming dan layanan digital. Sebagai penyedia top up game terkemuka.
                    </p>
                </div>
                <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
                    {Object.keys(groupedData).map((category, categoryIndex) => {
                        const chunkedCategoryData = chunkArray(groupedData[category], 5);
                        return chunkedCategoryData.map((chunk, chunkIndex) => (
                            <div key={`${category}-${chunkIndex}`} className="lg:w-1/4 md:w-1/2 w-full px-4">
                                <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
                                    {category.toUpperCase()}
                                </h2>
                                <nav className="list-none mb-10">
                                    {chunk.map((item, index) => (
                                        <li key={index}>
                                            <Link to={`/order/${item.slug}`} className="text-white hover:font-semibold">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </nav>
                            </div>
                        ));
                    })}
                </div>
            </div>
            <div className="bg-cokelat">
                <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
                    <p className="text-white text-sm text-center sm:text-left">© 2024 Nana Store —
                        <Link to="https://wa.me/6282229025162" rel="noopener noreferrer" className="text-white ml-1" target="_blank">@nanastore</Link>
                    </p>
                    <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
                    <Link to='https://instagram.com/nanaastoree' className="ml-3 text-white cursor-pointer">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-7 h-7" viewBox="0 0 24 24">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                        </svg>
                    </Link>
                    <Link to='https://t.me/storenanaa' className="ml-3 text-white cursor-pointer">
                        <svg fill="#000000" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-7 h-7" viewBox="0 0 32 32">
                        <path d="M22.122 10.040c0.006-0 0.014-0 0.022-0 0.209 0 0.403 0.065 0.562 0.177l-0.003-0.002c0.116 0.101 0.194 0.243 0.213 0.403l0 0.003c0.020 0.122 0.031 0.262 0.031 0.405 0 0.065-0.002 0.129-0.007 0.193l0-0.009c-0.225 2.369-1.201 8.114-1.697 10.766-0.21 1.123-0.623 1.499-1.023 1.535-0.869 0.081-1.529-0.574-2.371-1.126-1.318-0.865-2.063-1.403-3.342-2.246-1.479-0.973-0.52-1.51 0.322-2.384 0.221-0.23 4.052-3.715 4.127-4.031 0.004-0.019 0.006-0.040 0.006-0.062 0-0.078-0.029-0.149-0.076-0.203l0 0c-0.052-0.034-0.117-0.053-0.185-0.053-0.045 0-0.088 0.009-0.128 0.024l0.002-0.001q-0.198 0.045-6.316 4.174c-0.445 0.351-1.007 0.573-1.619 0.599l-0.006 0c-0.867-0.105-1.654-0.298-2.401-0.573l0.074 0.024c-0.938-0.306-1.683-0.467-1.619-0.985q0.051-0.404 1.114-0.827 6.548-2.853 8.733-3.761c1.607-0.853 3.47-1.555 5.429-2.010l0.157-0.031zM15.93 1.025c-8.302 0.020-15.025 6.755-15.025 15.060 0 8.317 6.742 15.060 15.060 15.060s15.060-6.742 15.060-15.060c0-8.305-6.723-15.040-15.023-15.060h-0.002q-0.035-0-0.070 0z"></path>
                        </svg>
                    </Link>
                </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
