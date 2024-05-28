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
        <footer className="text-white bg-cokelat body-font">
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
                        <Link to="https://twitter.com/knyttneve" rel="noopener noreferrer" className="text-white ml-1" target="_blank">@nanastore</Link>
                    </p>
                    <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
                        <Link className="ml-3 text-white cursor-pointer">
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                            </svg>
                        </Link>
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
