
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Helmet } from "react-helmet-async";

const PoliticaTroca = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Política de Troca e Cancelamento | BoneHeal</title>
        <meta name="description" content="Política de troca e cancelamento de produtos da BoneHeal" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Política de Troca e Cancelamento</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="mb-6">
                A Bone Heal tem o compromisso de proporcionar a melhor experiência possível aos seus clientes, por isso, disponibilizamos nossa política de devolução e cancelamento que visa estabelecer as regras para troca e devolução de produtos adquiridos em nosso site.
              </p>
              
              <h2 className="text-xl font-semibold text-primary my-4">1. Devolução por Arrependimento</h2>
              <p>
                De acordo com o art. 49 do Código de Defesa do Consumidor, o cliente pode desistir da compra em até 7 (sete) dias corridos após o recebimento do produto. Para exercer esse direito, o cliente deve comunicar sua decisão por meio de e-mail enviado para <strong>sac@boneheal.com.br</strong> ou WhatsApp no número <strong>(11) 94512-2884</strong>.
              </p>
              
              <h2 className="text-xl font-semibold text-primary my-4">2. Devolução por Defeito</h2>
              <p>
                Caso o produto apresente defeito, o cliente tem até 30 (trinta) dias para solicitar a troca ou devolução, conforme estabelecido pelo Código de Defesa do Consumidor. A solicitação deve ser feita através dos canais de atendimento: e-mail <strong>sac@boneheal.com.br</strong> ou WhatsApp no número <strong>(11) 94512-2884</strong>.
              </p>
              
              <h2 className="text-xl font-semibold text-primary my-4">3. Procedimento para Devolução</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>O produto deve ser devolvido em sua embalagem original, acompanhado da nota fiscal, sem indícios de uso e sem violação do lacre original, quando houver.</li>
                <li>Após a aprovação da solicitação de devolução, o cliente será orientado sobre o procedimento de envio do produto.</li>
                <li>O custo do frete de devolução será por conta da Bone Heal apenas nos casos de defeito ou divergência do produto.</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-primary my-4">4. Cancelamento de Pedido</h2>
              <p>
                O cancelamento do pedido pode ser solicitado antes do envio do produto, sem ônus para o cliente, através dos canais de atendimento: e-mail <strong>sac@boneheal.com.br</strong> ou WhatsApp no número <strong>(11) 94512-2884</strong>.
              </p>
              
              <h2 className="text-xl font-semibold text-primary my-4">5. Produtos Excluídos da Política</h2>
              <p>
                Alguns produtos possuem regras específicas e poderão não ser elegíveis para troca ou devolução, como:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Produtos personalizados ou confeccionados sob encomenda;</li>
                <li>Produtos que tenham suas embalagens abertas;</li>
                <li>Produtos com indícios de uso;</li>
                <li>Produtos com prazo de validade expirado ou próximo à expiração.</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-primary my-4">6. Reembolso</h2>
              <p>
                O reembolso será realizado pelo mesmo método de pagamento utilizado na compra:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Cartão de crédito: o estorno será solicitado junto à administradora do cartão, podendo levar até 2 faturas para ser efetivado, conforme as regras de cada operadora.</li>
                <li>Boleto bancário ou PIX: o valor será reembolsado através de transferência bancária para a conta indicada pelo cliente em até 10 dias úteis.</li>
              </ul>
              
              <p className="mt-8">
                Para mais informações ou esclarecimentos, entre em contato com nossa equipe de atendimento através do e-mail <strong>sac@boneheal.com.br</strong> ou WhatsApp no número <strong>(11) 94512-2884</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default PoliticaTroca;
