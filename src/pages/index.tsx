import { Global, css } from '@emotion/react'
import { Button, chakra, Container, Heading, Stack, Text, Image, Box, Grid, Avatar } from '@chakra-ui/react'
import SignupModal from 'components/auth'
import Link from 'next/link'

const Page = () => {
  return (
    <chakra.div color="#fff" fontWeight="500">
      <Global
        styles={css`
          body {
            background-color: #000000;
          }

          ::selection {
            background-color: var(--chakra-colors-purple-400);
            color: #fff;
          }

          ::-webkit-scrollbar {
            width: 0px;
            border-radius: 20px;
            background-color: rgba(0, 0, 0, 0.05);
          }

          ::-webkit-scrollbar-thumb {
            backgroundcolor: rgba(255, 255, 255, 12%);
          }
        `}
      />

      <chakra.nav w="100%" pos="fixed" top="0" left="0" right="0" zIndex="2">
        <Stack
          py={{ base: '12px', md: '24px' }}
          px={{ base: '16px', md: '48px' }}
          direction="row"
          justify="space-between"
          align="center"
        >
          <Image src="/logo.svg" alt="logo" boxSize="40px" />
          <SignupModal>
            <Button bgColor="white" rounded="full" size={{ base: 'sm', md: 'md' }} color="#000">
              Join now
            </Button>
          </SignupModal>
        </Stack>
      </chakra.nav>
      <Container maxW="100%" p="0" h={{ base: '90vh', md: '95vh' }} overflow="hidden">
        <Stack px={{ base: '12px', md: '8rem' }} pb={{ base: '16px', md: '6rem' }} pt={{ base: '3rem', md: '6rem' }}>
          <Heading
            as="h1"
            fontStyle="normal"
            fontWeight="700"
            fontSize={{ base: '80px', md: '146px' }}
            whiteSpace="nowrap"
            color="#000"
            lineHeight={{ base: '188px', md: '197px' }}
            css={{
              '-webkitTextStroke': '2px white',
              textStroke: '2px white'
            }}
          >
            Mediay
          </Heading>
        </Stack>

        <Stack
          bgImage="url(/images/bg_cover_image.png)"
          bgRepeat="no-repeat"
          bgSize="100%"
          // objectFit="cover"
          bgPos="center"
          px={{ base: '12px', md: '8rem' }}
          pt={{ base: '16px', md: '0rem' }}
          direction={{ base: 'column-reverse', md: 'row' }}
          spacing={{ base: '8', md: '0' }}
        >
          <Image src="images/hero_image_mediay.png" alt="mediay-app" boxSize={{ base: '100%', md: '85%' }} />
          <Heading
            w={{ base: '90%', md: '325px' }}
            fontWeight="500"
            fontSize={{ base: '32px', md: '48px' }}
            lineHeight={{ base: '43px', md: '65px' }}
            textTransform="capitalize"
            opacity=" 0.98"
            position="relative"
            left={{ base: '0', md: '-4rem' }}
            top={{ base: '0', md: '-7.2rem' }}
          >
            The platform for group subscriptions.
          </Heading>
        </Stack>
      </Container>

      <chakra.section pos="relative" overflow="hidden">
        <Container
          maxW="100%"
          p="0"
          bgImage="url(/images/bg_section_2.png)"
          bgRepeat="no-repeat"
          bgSize="cover"
          bgPos="center"

          // objectFit="cover"
        >
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing="0"
            align="center"
            justify="center"
            py={{ base: '12', md: '0' }}
            // spac
          >
            <Stack
              direction={{ base: 'column', md: 'column' }}
              position="relative"
              right={{ base: '0', md: '-16rem' }}
              spacing={{ base: '2', md: '6' }}
              px={{ base: '4', md: '0' }}
            >
              <Image
                src="images/create_groups.svg"
                alt="Create Groups"
                boxSize={{ base: '50%', md: '90%' }}
                alignSelf={{ base: 'flex-start', md: 'flex-start' }}
              />
              <Image
                src="images/share_subscriptions.svg"
                alt="Share Subscriptions"
                alignSelf={{ base: 'center', md: 'flex-start' }}
                boxSize={{ base: '70%', md: '100%' }}
              />
              <Image
                src="images/split_bills.svg"
                alt="Split Bills"
                boxSize={{ base: '40%', md: '80%' }}
                alignSelf={{ base: 'center', md: 'flex-end' }}
              />
            </Stack>
            <Stack
              flex="1"
              pt={{ base: '1rem', md: '4rem' }}
              pb={{ base: '1rem', md: '4rem' }}
              pl={{ base: '1rem', md: '4rem' }}
              align="flex-end"
              pr={{ base: '0', md: '4rem' }}
            >
              <Image src="images/hero_image_mediay.png" alt="mediay-app" boxSize={{ base: '100%', md: '90%' }} />
            </Stack>
          </Stack>
          <Stack overflow="hidden">
            <Image
              src="images/love_you_gesture.png"
              alt="love-you-gesture"
              boxSize={{ base: '50%', md: '32%' }}
              objectFit="contain"
              alignSelf="flex-end"
              pos="absolute"
              right={{ base: '0', md: '2rem' }}
              bottom={{ base: '-4rem', md: '-2rem' }}
            />
          </Stack>
        </Container>
      </chakra.section>

      <chakra.section>
        <Container maxW="100%" p="0" borderBottom="4px solid rgba(255, 255, 255, 0.04)">
          <Stack justify="center" align="center" spacing={{ base: '-2rem', md: '-6rem' }} py={{ base: '2rem', md: '1rem' }}>
            <Stack direction="row" spacing={{ base: '8', md: '12' }}>
              <Text
                fontSize={{ base: '32px', md: '100px' }}
                fontWeight="700"
                lineHeight={{ base: '43px', md: '136px' }}
                textTransform="uppercase"
              >
                Before
              </Text>
              <Text
                fontSize={{ base: '32px', md: '100px' }}
                fontWeight="700"
                lineHeight={{ base: '43px', md: '136px' }}
                textTransform="uppercase"
              >
                &
              </Text>
              <Text
                fontSize={{ base: '32px', md: '100px' }}
                fontWeight="700"
                lineHeight={{ base: '43px', md: '136px' }}
                color="#D2FC04"
                textTransform="uppercase"
              >
                After
              </Text>
            </Stack>
            <Heading
              color="#FA5B17"
              fontSize={{ base: '92px', md: '260px' }}
              fontWeight="700"
              lineHeight={{ base: '124px', md: '351px' }}
            >
              Mediay
            </Heading>
          </Stack>

          <Stack>
            <Image
              src="images/b_a.png"
              alt="Before and After Mediay"
              boxSize="100%"
              objectFit="contain"
              display={{ base: 'none', md: 'block' }}
            />
            <Image
              src="images/b_a_sm.svg"
              alt="Before and After Mediay"
              boxSize="100%"
              objectFit="contain"
              display={{ base: 'block', md: 'none' }}
            />
          </Stack>
        </Container>
      </chakra.section>

      <chakra.section>
        <Container maxW="100%" p="0">
          <Stack w="100%" overflow="hidden" direction="row" align="center" spacing={{ base: '8', md: '12' }}>
            <Heading
              fontStyle="normal"
              fontWeight="700"
              fontSize={{ base: '40px', md: '72px' }}
              whiteSpace="nowrap"
              color="#000"
              opacity="90%"
              lineHeight={{ base: '38px', md: '97px' }}
              textTransform="uppercase"
              css={{
                WebkitTextStroke: '1px white',
                textStroke: '2px white'
              }}
            >
              Join groups
            </Heading>
            <Heading
              fontStyle="normal"
              fontWeight="700"
              fontSize={{ base: '40px', md: '72px' }}
              whiteSpace="nowrap"
              lineHeight={{ base: '38px', md: '97px' }}
              textTransform="uppercase"
            >
              Copy credidentials
            </Heading>
            <Heading
              fontStyle="normal"
              fontWeight="700"
              fontSize={{ base: '40px', md: '72px' }}
              whiteSpace="nowrap"
              color="#000"
              opacity="90%"
              lineHeight={{ base: '38px', md: '97px' }}
              textTransform="uppercase"
              css={{
                WebkitTextStroke: '1px white',
                textStroke: '2px white'
              }}
            >
              Enjoy
            </Heading>
          </Stack>
          <Stack w="100%" overflow="hidden" direction="row" align="center" spacing={{ base: '', md: '12' }}>
            <Heading
              fontStyle="normal"
              fontWeight="700"
              fontSize={{ base: '40px', md: '72px' }}
              whiteSpace="nowrap"
              color="#000"
              opacity="90%"
              lineHeight={{ base: '38px', md: '97px' }}
              textTransform="uppercase"
              css={{
                WebkitTextStroke: '1px white',
                textStroke: '2px white'
              }}
            >
              Invite friends
            </Heading>
            <Heading
              fontStyle="normal"
              fontWeight="700"
              fontSize={{ base: '40px', md: '72px' }}
              whiteSpace="nowrap"
              lineHeight={{ base: '38px', md: '97px' }}
              textTransform="uppercase"
            >
              Add subscribtions
            </Heading>
            <Heading
              fontStyle="normal"
              fontWeight="700"
              fontSize={{ base: '40px', md: '72px' }}
              whiteSpace="nowrap"
              color="#000"
              opacity="90%"
              lineHeight={{ base: '38px', md: '97px' }}
              textTransform="uppercase"
              css={{
                WebkitTextStroke: '1px white',
                textStroke: '2px white'
              }}
            >
              Share
            </Heading>
          </Stack>
        </Container>

        <chakra.aside h={{ base: '40vh', md: '50vh' }}>
          <Stack align="center" w="100%" justify="center" h="100%">
            <Button
              fontWeight="700"
              fontSize={{ base: '28px', md: '32px' }}
              lineHeight=" 43px"
              textTransform="capitalize"
              bgColor="#E70808"
              color="rgba(255, 255, 255, 0.87)"
              size="lg"
              px={{ base: '6rem', md: '10rem' }}
              py={{ base: '2rem', md: '2.4rem' }}
              rounded="12px"
              alignSelf="center"
            >
              Join Now
            </Button>
          </Stack>
        </chakra.aside>
      </chakra.section>

      {/* Sponsors */}
      <chakra.aside pos="fixed" bottom="0" right="0" left="0" p={{ base: '8px', md: '12px' }}>
        <Stack py={{ base: '1rem', md: '1.8rem' }} px={{ base: '1.2rem', md: '1.8rem' }}>
          <Text>Built with ❤️ —MnR</Text>
          <Link href="https://www.instagram.com/marvin.kome/">
            <Avatar src="/images/marv.png" name="Marvin" size="sm" />
          </Link>
          <Link href="https://www.instagram.com/lordrose0x/">
            <Avatar src="/images/rose.JPG" name="Roosevelt" size="sm" />
          </Link>
        </Stack>
      </chakra.aside>

      <chakra.footer bgColor="#7026EA">
        <Container maxW="100%" p="0" bgImage="url(/images/bg_footer.png)" bgRepeat="no-repeat" bgSize="100%" bgPos="center">
          <Grid
            overflow="hidden"
            pb={{ base: '8', md: '8' }}
            templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          >
            <Stack justify="space-between" h="100%" align="le`ft" gridColumn={{ base: '1 / 1', md: '1 / 3' }}>
              <Text fontSize={{ base: '28px', md: '68px' }} fontWeight="700" lineHeight={{ base: '36px', md: '68px' }}>
                In the future, everyone will be subscribed to a service for convenience and FOMO.
              </Text>
              <Stack w={{ base: '30%', md: '40%' }} align="center" p={{ base: '0', md: '24px' }}>
                <Text
                  textTransform="uppercase"
                  opacity="68%"
                  fontSize={{ base: '10px', md: '13px' }}
                  fontWeight="400"
                  letterSpacing="0.08em"
                  whiteSpace="nowrap"
                >
                  © {new Date().getFullYear()} Mediay.
                </Text>
              </Stack>
            </Stack>

            <Stack justify="flex-start" align="flex-end" pt={{ base: '1rem', md: '1rem' }}>
              <Stack transform="rotate(-90deg)" spacing={{ base: '-0.2rem', md: '-0.8rem' }}>
                <Heading
                  as="h1"
                  fontStyle="normal"
                  fontWeight="700"
                  fontSize={{ base: '62px', md: '80px' }}
                  whiteSpace="nowrap"
                  lineHeight={{ base: '58px', md: '96px' }}
                  textTransform="uppercase"
                >
                  Mediay
                </Heading>
                <Heading
                  fontStyle="normal"
                  fontWeight="700"
                  fontSize={{ base: '62px', md: '80px' }}
                  whiteSpace="nowrap"
                  color="transparent"
                  lineHeight={{ base: '58px', md: '68px' }}
                  textTransform="uppercase"
                  css={{
                    WebkitTextStroke: '2px white',
                    textStroke: '2px white'
                  }}
                >
                  Mediay
                  <br /> Mediay
                  <br /> Mediay
                </Heading>
              </Stack>
            </Stack>
          </Grid>
        </Container>
      </chakra.footer>
    </chakra.div>
  )
}

export default Page
