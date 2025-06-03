'use client';

import Layout from '../../components/Layout';
import { useSnippetStore } from '../../store/useSnippetStore';

export default function SnippetsPage() {
  const { snippets } = useSnippetStore();

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Code Snippets</h1>
        
        {snippets.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Пока нет сниппетов. Добавьте первый!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {snippets.map(snippet => (
              <div key={snippet.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{snippet.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{snippet.language}</p>
                {/* Здесь будем отображать код с подсветкой */}
                <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded overflow-x-auto text-sm">
                  <code>{snippet.code.substring(0, 100)}...</code>
                </pre>
                {/* Добавить кнопки для редактирования/удаления */}
              </div>
            ))}
          </div>
        )}

        {/* Кнопка добавления сниппета */} 
        {/* <button className="...">Новый сниппет</button> */}

      </div>
    </Layout>
  );
} 
