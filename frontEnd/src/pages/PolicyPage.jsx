import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const PolicyPage = ({ title, content }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
          <div className="prose prose-blue max-w-none text-gray-700">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h3 className="text-xl font-semibold mb-2">1. Introdução</h3>
                <p className="mb-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <h3 className="text-xl font-semibold mb-2">2. Coleta de Dados</h3>
                <p className="mb-4">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PolicyPage;