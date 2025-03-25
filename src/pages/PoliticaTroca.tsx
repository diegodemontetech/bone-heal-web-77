
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary text-center">
              Política de Troca e Cancelamento
            </h1>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="bg-gray-50 p-6 rounded-lg mb-8 border-l-4 border-primary">
                <p className="italic text-gray-700">
                  Na BoneHeal, prezamos pela transparência e satisfação dos nossos clientes. Estamos comprometidos em oferecer produtos de alta qualidade e um atendimento excepcional, sempre em conformidade com o Código de Defesa do Consumidor (Lei nº 8.078/90).
                </p>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <h2 className="text-xl font-semibold text-primary my-4">1. Direito de Arrependimento</h2>
                <p>
                  De acordo com o art. 49 do Código de Defesa do Consumidor, o consumidor pode desistir da compra realizada fora do estabelecimento comercial (como compras online) no prazo de 7 (sete) dias corridos, a contar da data do recebimento do produto.
                </p>
                <p>
                  Para exercer esse direito, o cliente deve entrar em contato conosco através do e-mail <strong>sac@boneheal.com.br</strong> ou pelo WhatsApp <strong>(11) 94512-2884</strong>, informando sua intenção de devolução.
                </p>
                
                <h2 className="text-xl font-semibold text-primary my-4">2. Devolução por Defeito ou Vício do Produto</h2>
                <p>
                  Conforme estabelecido nos artigos 18 a 25 do CDC, produtos com defeitos ou vícios têm garantia legal de 30 dias para produtos não duráveis e 90 dias para produtos duráveis, contados a partir da entrega efetiva do produto.
                </p>
                <p>
                  Caso o produto apresente algum defeito ou não funcione adequadamente, o cliente deverá comunicar o problema por meio dos nossos canais de atendimento no prazo legal.
                </p>
                
                <h2 className="text-xl font-semibold text-primary my-4">3. Procedimento para Devolução</h2>
                <ul className="list-disc pl-6 mb-6">
                  <li>O produto deve ser devolvido em sua embalagem original, sem indícios de uso, acompanhado da nota fiscal.</li>
                  <li>Após a aprovação da solicitação de devolução, orientaremos sobre o procedimento de envio do produto.</li>
                  <li>O custo do frete de devolução será por conta da BoneHeal apenas nos casos de defeito do produto ou divergência do item anunciado.</li>
                </ul>
                
                <h2 className="text-xl font-semibold text-primary my-4">4. Cancelamento de Pedido</h2>
                <p>
                  O cancelamento do pedido pode ser solicitado antes do envio do produto, sem ônus para o cliente. Após o envio, aplicam-se as regras de devolução.
                </p>
                <p>
                  Para solicitar o cancelamento, entre em contato através do e-mail <strong>sac@boneheal.com.br</strong> ou WhatsApp <strong>(11) 94512-2884</strong>.
                </p>
                
                <h2 className="text-xl font-semibold text-primary my-4">5. Produtos não Elegíveis para Devolução</h2>
                <p>
                  Alguns produtos possuem regras específicas e poderão não ser elegíveis para troca ou devolução:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Produtos personalizados ou confeccionados sob encomenda;</li>
                  <li>Produtos com embalagens violadas;</li>
                  <li>Produtos com indícios de uso inadequado;</li>
                  <li>Produtos com prazo de validade expirado ou próximo à expiração.</li>
                </ul>
                
                <h2 className="text-xl font-semibold text-primary my-4">6. Reembolso</h2>
                <p>
                  O reembolso será processado em até 10 dias úteis após o recebimento e análise do produto devolvido, por meio do mesmo método de pagamento utilizado na compra:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Cartão de crédito: o estorno será solicitado junto à administradora do cartão, podendo levar até 2 faturas para ser efetivado.</li>
                  <li>Boleto bancário ou PIX: o valor será reembolsado via transferência bancária.</li>
                </ul>
                
                <h2 className="text-xl font-semibold text-primary my-4">7. Política de Cookies</h2>
                <p>
                  Nosso site utiliza cookies para melhorar a experiência do usuário. Estes são pequenos arquivos de texto armazenados em seu dispositivo que nos ajudam a:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Lembrar suas preferências e configurações;</li>
                  <li>Entender como você utiliza nosso site;</li>
                  <li>Personalizar sua experiência de compra;</li>
                  <li>Melhorar continuamente nossos serviços.</li>
                </ul>
                <p>
                  Ao navegar em nosso site, você concorda com o uso de cookies conforme nossa Política de Privacidade.
                </p>
                
                <p className="mt-8 bg-gray-50 p-4 rounded">
                  Para mais informações ou esclarecimentos adicionais, entre em contato com nossa equipe de atendimento através do e-mail <strong>sac@boneheal.com.br</strong> ou WhatsApp <strong>(11) 94512-2884</strong>.
                </p>
              </div>
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
